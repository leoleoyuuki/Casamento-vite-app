import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion,
  Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = process.env.VERCEL ? '/tmp/whatsapp_session' : path.resolve('./whatsapp_session');

// Estado interno do serviço
let sock = null;
let qrCodeDataUrl = null;
let connectionStatus = 'DISCONNECTED'; // 'DISCONNECTED' | 'CONNECTING' | 'QR_READY' | 'CONNECTED'
let connectedUser = null;
let lastError = null;
let connectionWaiters = [];
let reconnectAttempts = 0;

// Garante que o diretório de sessão local existe
if (!fs.existsSync(AUTH_DIR)) {
  try {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  } catch (e) {}
}

/**
 * Normaliza e formata um número brasileiro para o formato WhatsApp JID (ex: 5511999999999@s.whatsapp.net)
 */
export function formatBrazilianPhoneToJid(phone) {
  if (!phone) throw new Error('Número de telefone não informado.');

  let cleaned = String(phone).replace(/\D/g, '');

  // Se o número tiver 10 ou 11 dígitos (DDD + número), adiciona o DDI do Brasil (55)
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }

  // Validação básica do tamanho com DDI (55 + DDD + 8 ou 9 dígitos = 12 ou 13 dígitos)
  if (cleaned.length < 12 || cleaned.length > 14) {
    throw new Error(`Número de telefone inválido: "${phone}". Use o formato com DDD, ex: (11) 98765-4321.`);
  }

  return `${cleaned}@s.whatsapp.net`;
}

/**
 * Gera o texto da mensagem de agradecimento personalizada (sem valor)
 */
export function getThankYouWhatsAppMessage(guestName = 'Amigo(a)', giftTitle = 'Presente de Casamento') {
  return `✨ *Muito Obrigado pelo seu Presente!* ✨
💍 *Casamento Ana Clara & Dener*

Olá, *${(guestName || 'Amigo(a)').trim()}*! 🤍

Nosso coração se enche de gratidão e alegria com o seu carinho! Saber que temos o seu carinho e apoio neste momento tão especial torna tudo ainda mais inesquecível.

🎁 *Presente:* ${giftTitle}

Mal podemos esperar para celebrar juntos no nosso grande dia!

Com todo o nosso amor e gratidão,
*Ana Clara & Dener* 👰🏻‍♀️🤵🏻‍♂️
_28 de Novembro de 2026_`;
}

/**
 * Inicializa a conexão com o WhatsApp usando Baileys estritamente para envio de mensagens
 */
export async function initWhatsAppClient() {
  if (connectionStatus === 'CONNECTED' && sock) {
    console.log('✅ [WHATSAPP] WhatsApp já está conectado.');
    return;
  }

  if (connectionStatus === 'CONNECTING') {
    console.log('⏳ [WHATSAPP] Conexão já em andamento, aguardando...');
    return;
  }

  connectionStatus = 'CONNECTING';
  lastError = null;

  // Fecha socket anterior se existente
  if (sock) {
    try {
      sock.ev.removeAllListeners();
      sock.end();
    } catch (e) {}
    sock = null;
  }

  try {
    console.log('🔄 [WHATSAPP] Inicializando cliente Baileys (Apenas Envios)...');

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1043857760], isLatest: true }));

    console.log(`📱 [WHATSAPP] Baileys versão v${version.join('.')}, isLatest: ${isLatest}`);

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false, // Não sincroniza histórico antigo
      shouldSyncHistoryMessage: () => false, // Não processa mensagens antigas
      markOnlineOnConnect: false, // Não altera status de online
      generateHighQualityLinkPreview: false,
      connectTimeoutMs: 30000,
      defaultQueryTimeoutMs: 15000,
      keepAliveIntervalMs: 25000
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 8 });
          connectionStatus = 'QR_READY';
          console.log('📱 [WHATSAPP] Novo QR Code gerado! Pronto para leitura no painel.');
        } catch (qrErr) {
          console.error('❌ [WHATSAPP] Erro ao converter QR Code para DataURL:', qrErr);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        
        console.warn(`⚠️ [WHATSAPP] Conexão encerrada. Motivo (Status Code): ${statusCode}`);

        if (connectionWaiters.length > 0) {
          const waiters = [...connectionWaiters];
          connectionWaiters = [];
          waiters.forEach(w => w.reject(new Error(`Conexão encerrada: ${statusCode}`)));
        }

        connectionStatus = 'DISCONNECTED';
        qrCodeDataUrl = null;

        if (statusCode === DisconnectReason.connectionReplaced || statusCode === 440) {
          console.warn('⚠️ [WHATSAPP] Conexão substituída (440). Outra sessão do WhatsApp está conectada. Parando reconexão.');
          lastError = 'Conexão substituída (440). O WhatsApp foi aberto em outra sessão.';
          reconnectAttempts = 0;
          return;
        }

        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
          console.warn('⚠️ [WHATSAPP] Sessão desconectada pelo celular (401). Limpando dados locais...');
          connectedUser = null;
          lastError = 'Desconectado do WhatsApp. É necessário ler o QR Code novamente.';
          reconnectAttempts = 0;
          await clearStoredSession();
          return;
        }

        if (statusCode === DisconnectReason.forbidden || statusCode === 403) {
          lastError = 'Acesso não autorizado ao WhatsApp (403).';
          reconnectAttempts = 0;
          return;
        }

        // Reconexão para códigos transitórios
        if (reconnectAttempts < 3) {
          reconnectAttempts++;
          console.log(`🔄 [WHATSAPP] Reconectando em 6s (tentativa ${reconnectAttempts}/3)...`);
          setTimeout(() => {
            initWhatsAppClient().catch(console.error);
          }, 6000);
        } else {
          console.warn('⚠️ [WHATSAPP] Limite de reconexões automáticas atingido. Aguardando comando manual.');
          reconnectAttempts = 0;
        }

      } else if (connection === 'open') {
        connectionStatus = 'CONNECTED';
        qrCodeDataUrl = null;
        connectedUser = sock.user || { id: 'WhatsApp Conectado' };
        lastError = null;
        reconnectAttempts = 0;
        console.log(`✅ [WHATSAPP] Conectado com sucesso! Usuário: ${sock.user?.id || 'OK'}`);

        if (connectionWaiters.length > 0) {
          const waiters = [...connectionWaiters];
          connectionWaiters = [];
          waiters.forEach(w => w.resolve(sock));
        }
      }
    });

  } catch (err) {
    console.error('❌ [WHATSAPP] Falha ao inicializar cliente Baileys:', err);
    connectionStatus = 'DISCONNECTED';
    lastError = err.message;
    if (connectionWaiters.length > 0) {
      const waiters = [...connectionWaiters];
      connectionWaiters = [];
      waiters.forEach(w => w.reject(err));
    }
  }
}

/**
 * Garante que o WhatsApp está conectado antes de enviar mensagens
 */
export async function ensureWhatsAppConnected(timeoutMs = 15000) {
  if (connectionStatus === 'CONNECTED' && sock) {
    return sock;
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      connectionWaiters = connectionWaiters.filter(w => w.resolve !== resolve);
      reject(new Error(`Tempo limite de ${timeoutMs/1000}s excedido ao conectar ao WhatsApp.`));
    }, timeoutMs);

    connectionWaiters.push({
      resolve: (s) => {
        clearTimeout(timer);
        resolve(s);
      },
      reject: (e) => {
        clearTimeout(timer);
        reject(e);
      }
    });

    if (connectionStatus === 'DISCONNECTED') {
      initWhatsAppClient().catch(err => {
        clearTimeout(timer);
        reject(err);
      });
    }
  });
}

/**
 * Retorna o status atual da conexão e QR Code
 */
// Retorna o status atual da conexão e QR Code
export async function getWhatsAppStatus() {
  const externalApiUrl = (process.env.WHATSAPP_API_URL || '').trim().replace(/\/$/, '');
  if (externalApiUrl) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.WHATSAPP_API_KEY) headers['x-api-key'] = process.env.WHATSAPP_API_KEY;
      
      const res = await fetch(`${externalApiUrl}/api/status`, { headers });
      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          isMicroservice: true,
          storage: 'Microserviço Externo (24/7)'
        };
      }
    } catch (e) {
      return {
        status: 'DISCONNECTED',
        isConnected: false,
        qrCode: null,
        user: null,
        error: `Erro ao conectar com microserviço (${externalApiUrl}): ${e.message}`,
        isMicroservice: true,
        storage: 'Microserviço Externo (Offline)'
      };
    }
  }

  return {
    status: connectionStatus,
    isConnected: connectionStatus === 'CONNECTED',
    qrCode: qrCodeDataUrl,
    user: connectedUser,
    error: lastError,
    storage: 'Local (Apenas Envios)',
    isMicroservice: false
  };
}

/**
 * Envia uma mensagem de texto simples para um número de telefone
 */
export async function sendWhatsAppTextMessage(phone, text) {
  const externalApiUrl = (process.env.WHATSAPP_API_URL || '').trim().replace(/\/$/, '');
  
  // Se houver microserviço configurado, envia via HTTP para ele
  if (externalApiUrl) {
    console.log(`🌐 [WHATSAPP MICROSERVIÇO] Encaminhando mensagem para ${phone} via ${externalApiUrl}...`);
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.WHATSAPP_API_KEY) headers['x-api-key'] = process.env.WHATSAPP_API_KEY;

    const res = await fetch(`${externalApiUrl}/api/send`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone, text })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Falha no microserviço de WhatsApp (${res.status})`);
    }
    console.log(`✅ [WHATSAPP MICROSERVIÇO SUCESSO] Entregue para ${phone}! ID: ${data?.messageId || 'OK'}`);
    return data;
  }

  // Fallback: Baileys Local
  const activeSock = await ensureWhatsAppConnected();

  const rawJid = formatBrazilianPhoneToJid(phone);
  console.log(`📤 [WHATSAPP 1/3] Validando destinatário para ${rawJid}...`);

  let targetJid = rawJid;
  try {
    const onWa = await Promise.race([
      activeSock.onWhatsApp(rawJid),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]).catch(() => null);

    if (onWa && onWa[0]?.exists && onWa[0]?.jid) {
      targetJid = onWa[0].jid;
      console.log(`📍 [WHATSAPP 2/3] Destinatário verificado: ${targetJid}`);
    }
  } catch (checkErr) {
    console.warn('Aviso ao verificar onWhatsApp:', checkErr.message);
  }

  console.log(`📤 [WHATSAPP 3/3] Enviando mensagem para ${targetJid}...`);

  const result = await activeSock.sendMessage(targetJid, { text });
  console.log(`✅ [WHATSAPP SUCESSO] Mensagem entregue para ${targetJid}! ID: ${result?.key?.id}`);
  return result;
}

/**
 * Envia mensagem de agradecimento pelo presente
 */
export async function sendGiftThankYouWhatsApp({ phone, guestName, giftTitle }) {
  const externalApiUrl = (process.env.WHATSAPP_API_URL || '').trim().replace(/\/$/, '');
  
  if (externalApiUrl) {
    console.log(`🌐 [WHATSAPP MICROSERVIÇO] Enviando agradecimento para ${phone} via microserviço...`);
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.WHATSAPP_API_KEY) headers['x-api-key'] = process.env.WHATSAPP_API_KEY;

    const res = await fetch(`${externalApiUrl}/api/send-gift-thankyou`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone, guestName, giftTitle })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      // Tenta fallback com /api/send e texto gerado
      const messageText = getThankYouWhatsAppMessage(guestName, giftTitle);
      return await sendWhatsAppTextMessage(phone, messageText);
    }
    return data;
  }

  const messageText = getThankYouWhatsAppMessage(guestName, giftTitle);
  return await sendWhatsAppTextMessage(phone, messageText);
}

/**
 * Limpa a sessão armazenada localmente
 */
async function clearStoredSession() {
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      console.log('🗑️ [WHATSAPP] Sessão local limpa.');
    }
  } catch (cleanErr) {
    console.error('Erro ao limpar pasta local de sessão:', cleanErr);
  }
}

/**
 * Desconecta e limpa a sessão do WhatsApp
 */
export async function logoutWhatsApp() {
  const externalApiUrl = (process.env.WHATSAPP_API_URL || '').trim().replace(/\/$/, '');
  if (externalApiUrl) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.WHATSAPP_API_KEY) headers['x-api-key'] = process.env.WHATSAPP_API_KEY;
      const res = await fetch(`${externalApiUrl}/api/logout`, { method: 'POST', headers });
      return await res.json();
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  try {
    if (sock) {
      await sock.logout().catch(() => {});
      sock.end();
      sock = null;
    }
  } catch (e) {
    console.warn('[WHATSAPP LOGOUT]:', e.message);
  }

  connectionStatus = 'DISCONNECTED';
  qrCodeDataUrl = null;
  connectedUser = null;
  reconnectAttempts = 0;

  await clearStoredSession();

  return { success: true, message: 'WhatsApp desconectado com sucesso.' };
}

