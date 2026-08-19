import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import { 
  initWhatsAppClient, 
  getWhatsAppStatus, 
  sendGiftThankYouWhatsApp, 
  sendWhatsAppTextMessage, 
  logoutWhatsApp 
} from './services/whatsappService.js';

dotenv.config();

// Configuração do Firebase Admin (Segurança para Vercel)
let serviceAccount = null;
let db = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const jsonString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(jsonString);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (fs.existsSync('./casamento-vite-app-firebase-adminsdk-fbsvc-b29810b662.json')) {
    serviceAccount = JSON.parse(fs.readFileSync('./casamento-vite-app-firebase-adminsdk-fbsvc-b29810b662.json', 'utf8'));
  }

  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
    console.log("✅ [FIREBASE] Banco de dados conectado com sucesso.");
  } else {
    console.warn("⚠️ [FIREBASE] Nenhuma credencial configurada. Defina FIREBASE_SERVICE_ACCOUNT nas variáveis de ambiente da Vercel.");
  }
} catch (err) {
  console.error("⚠️ [FIREBASE] Erro crítico ao conectar banco:", err.message);
}

// Inicializar cliente do WhatsApp (Modo Apenas Envio)
initWhatsAppClient().catch(err => {
  console.warn('⚠️ [WHATSAPP] Inicialização em segundo plano:', err.message);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data store for testing
const rsvpStore = [];
const messageStore = [
  {
    id: 1,
    author: "Leonardo Yuuki",
    relationship: "Amigo dos Noivos",
    date: "02/08/2026",
    text: "Que alegria gigante ver a união de vocês se concretizando! Que Deus abençoe cada passo dessa linda jornada juntos. Contem comigo sempre!"
  },
  {
    id: 2,
    author: "Família Allemany",
    relationship: "Família da Noiva",
    date: "01/08/2026",
    text: "Ana Clara e Dener, nosso coração se enche de orgulho e amor ao ver o carinho e o respeito que vocês constroem a cada dia. O casamento de vocês será abençoado!"
  }
];

// Helper: Asaas API Headers (preserva a chave intacta com $aact_)
const getAsaasHeaders = () => {
  let key = (process.env.ASAAS_API_KEY || '').trim();
  // Remove aspas simples/duplas das pontas se houver
  key = key.replace(/^['"]|['"]$/g, '').trim();
  return {
    'Content-Type': 'application/json',
    'access_token': key
  };
};

// Helper: Determina a URL base (Sandbox vs Produção) dinamicamente
const getAsaasBaseUrl = () => {
  if (process.env.ASAAS_ENVIRONMENT === 'production') {
    return 'https://www.asaas.com/api/v3';
  }
  return 'https://sandbox.asaas.com/api/v3';
};

// ----------------------------------------------------
// ASAAS INTEGRATION ENDPOINTS
// ----------------------------------------------------

// 1. Simular / Obter Opções de Parcelamento (Taxas absorvidas pelos noivos)
app.post('/api/asaas/installments', (req, res) => {
  const { value, maxInstallments = 12 } = req.body;
  const numVal = parseFloat(value) || 100;
  
  const options = [];
  const limit = Math.min(maxInstallments, Math.floor(numVal / 10)); // Mínimo R$ 10 por parcela
  
  for (let i = 1; i <= Math.max(1, limit); i++) {
    const installmentValue = (numVal / i).toFixed(2);
    options.push({
      installmentCount: i,
      installmentValue: parseFloat(installmentValue),
      totalValue: numVal,
      description: i === 1 ? `1x de R$ ${installmentValue} à vista` : `${i}x de R$ ${installmentValue} sem juros para o convidado`
    });
  }

  res.json({ success: true, value: numVal, options });
});

// 2. Criar Cobrança PIX no Asaas
app.post('/api/asaas/pix', async (req, res) => {
  try {
    const { giftTitle, amount, guestName, guestPhone, guestEmail, guestCpf } = req.body;
    
    console.log(`[ASAAS PIX] Gerando PIX para ${guestName} (${guestPhone || 'sem telefone'}) - Presente: ${giftTitle} (R$ ${amount})`);
    
    // Se houver chave API válida no Asaas
    if (process.env.ASAAS_API_KEY) {
      // 1. Criar Cliente
      const customerRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: getAsaasHeaders(),
        body: JSON.stringify({
          name: guestName || 'Convidado Casamento',
          email: guestEmail || 'convidado@casamento.com',
          mobilePhone: guestPhone ? guestPhone.replace(/\D/g, '') : undefined,
          cpfCnpj: guestCpf || '00000000000'
        })
      });
      const customer = await customerRes.json();

      // 2. Criar Cobrança PIX
      const paymentRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: getAsaasHeaders(),
        body: JSON.stringify({
          customer: customer.id,
          billingType: 'PIX',
          value: parseFloat(amount),
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 dias
          description: `Presente de Casamento: ${giftTitle}`
        })
      });
      const payment = await paymentRes.json();

      // 3. Obter QR Code PIX
      const qrRes = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}/pixQrCode`, {
        headers: getAsaasHeaders()
      });
      const qrData = await qrRes.json();

      return res.json({
        success: true,
        paymentId: payment.id,
        copyAndPaste: qrData.payload,
        qrCodeImage: qrData.encodedImage ? `data:image/png;base64,${qrData.encodedImage}` : null,
        expirationDate: payment.dueDate
      });
    }

    // Modo de Demonstração / Sandbox Fallback Local
    const pixPayload = `00020126580014BR.GOV.BCB.PIX0136ana-e-dener-casamento-2026@asaas.com520400005303986540${amount.toFixed(2).replace('.', '')}5802BR5925Ana Clara e Dener Casamento6009Sao Paulo62070503***6304E2B1`;
    const qrCodeImageDataUrl = await QRCode.toDataURL(pixPayload);

    res.json({
      success: true,
      paymentId: `PAY-SANDBOX-${Date.now()}`,
      copyAndPaste: pixPayload,
      qrCodeImage: qrCodeImageDataUrl,
      expirationDate: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR')
    });
  } catch (error) {
    console.error('Erro ao gerar PIX Asaas:', error);
    res.status(500).json({ success: false, message: 'Erro ao gerar cobrança PIX no Asaas.' });
  }
});

// Helper: Gera CPF Válido para criação de cobranças no Asaas
function generateValidCPF() {
  const rnd = (n) => Math.round(Math.random() * n);
  const mod = (n, m) => Math.round(n - Math.floor(n / m) * m);
  const n = Array(9).fill(0).map(() => rnd(9));
  let d1 = n.reduce((total, number, index) => total + number * (10 - index), 0);
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;
  let d2 = n.reduce((total, number, index) => total + number * (11 - index), 0) + d1 * 2;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;
  return `${n.join('')}${d1}${d2}`;
}

// 2. Criar Cobrança e Gerar Link para o Checkout Hospedado Oficial do Asaas (invoiceUrl)
app.post('/api/asaas/create-checkout', async (req, res) => {
  try {
    const { giftTitle, amount, guestName, guestPhone, guestEmail, guestCpf } = req.body;
    console.log(`[ASAAS CHECKOUT HOSPEDADO] Gerando checkout para presente "${giftTitle}" (R$ ${amount}) - Convidado: ${guestName} (${guestPhone || 'sem telefone'})`);

    const apiKey = (process.env.ASAAS_API_KEY || '').trim();
    
    if (!apiKey || apiKey.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Chave de API do Asaas não configurada no servidor. Por favor, adicione a chave no arquivo .env.'
      });
    }

    const cleanCpf = guestCpf ? guestCpf.replace(/\D/g, '') : '';
    const finalCpf = (cleanCpf.length === 11 || cleanCpf.length === 14) ? cleanCpf : generateValidCPF();

    // Tenta primeiro o ambiente configurado (Sandbox ou Produção)
    let baseUrl = getAsaasBaseUrl();
    
    // 1. Criar Cliente no Asaas
    let customerRes = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: getAsaasHeaders(),
      body: JSON.stringify({
        name: guestName || 'Convidado de Casamento',
        email: guestEmail || 'convidado@casamento.com',
        mobilePhone: guestPhone ? guestPhone.replace(/\D/g, '') : undefined,
        cpfCnpj: finalCpf
      })
    });
    let customer = await customerRes.json();

    // Se falhar no Sandbox, tenta automaticamente na Produção (caso a chave seja da conta real)
    if (customer.errors && customer.errors[0]?.code === 'invalid_access_token' && baseUrl.includes('sandbox')) {
      console.log('[ASAAS API INFO] Chave não reconhecida no Sandbox. Testando ambiente de Produção...');
      baseUrl = 'https://www.asaas.com/api/v3';
      customerRes = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: getAsaasHeaders(),
        body: JSON.stringify({
          name: guestName || 'Convidado de Casamento',
          email: guestEmail || 'convidado@casamento.com',
          mobilePhone: guestPhone ? guestPhone.replace(/\D/g, '') : undefined,
          cpfCnpj: finalCpf
        })
      });
      customer = await customerRes.json();
    }

    if (customer.errors) {
      console.error('[ASAAS CLIENTE ERRO]:', customer.errors);
      return res.status(400).json({
        success: false,
        message: customer.errors[0]?.description || 'Chave de API do Asaas inválida. Verifique a chave nas Configurações da Conta do Asaas.'
      });
    }

    // Criar Cobrança Hospedada (billingType UNDEFINED habilita PIX e Cartão até 12x no Checkout oficial)
    const paymentPayload = {
      customer: customer.id,
      billingType: 'UNDEFINED',
      value: parseFloat(amount),
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      description: `Presente de Casamento (Ana Clara & Dener): ${giftTitle}`,
      maxInstallments: 12
    };

    const paymentRes = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: getAsaasHeaders(),
      body: JSON.stringify(paymentPayload)
    });
    const paymentData = await paymentRes.json();

    if (paymentData.errors) {
      console.error('[ASAAS CHECKOUT ERRO]:', paymentData.errors);
      return res.status(400).json({
        success: false,
        message: paymentData.errors[0]?.description || 'Erro ao gerar checkout no Asaas.'
      });
    }

    // Salvar presente no Firestore com status PENDING
    try {
      if (db) {
        await db.collection('gifts').doc(paymentData.id).set({
          paymentId: paymentData.id,
          giftTitle: giftTitle,
          amount: parseFloat(amount),
          guestName: guestName || 'Amigo(a)',
          guestPhone: guestPhone || '',
          guestEmail: guestEmail || '',
          guestCpf: finalCpf,
          status: 'PENDING',
          createdAt: FieldValue.serverTimestamp()
        });
        console.log(`[FIRESTORE] Presente PENDING registrado: ${paymentData.id}`);
      }
    } catch (fsErr) {
      console.error('[FIRESTORE ERRO] Falha ao registrar presente pendente:', fsErr);
    }

    return res.json({
      success: true,
      invoiceUrl: paymentData.invoiceUrl,
      paymentId: paymentData.id,
      message: 'Checkout seguro gerado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao gerar Checkout Hospedado Asaas:', error);
    res.status(500).json({ success: false, message: 'Erro ao conectar ao checkout seguro do Asaas.' });
  }
});

// 3. Processar Cartão de Crédito no Asaas
app.post('/api/asaas/credit-card', async (req, res) => {
  try {
    const { 
      giftTitle, 
      amount, 
      guestName, 
      guestEmail, 
      guestCpf, 
      installments = 1,
      cardHolderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      ccv
    } = req.body;

    console.log(`[ASAAS CARTÃO] Processando presente "${giftTitle}" (R$ ${amount}) em ${installments}x para ${guestName}`);

    const cleanCardNum = cardNumber.replace(/\s/g, '');

    // 1. Validação prévia de formato e número de cartão (Algoritmo de Luhn)
    const isValidLuhn = (num) => {
      const clean = num.replace(/\D/g, '');
      if (clean.length < 13 || clean.length > 19) return false;
      let sum = 0, shouldDouble = false;
      for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean.charAt(i), 10);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };

    if (!isValidLuhn(cleanCardNum)) {
      console.warn(`[ASAAS CARTÃO] Número de cartão inválido recusado: ${cleanCardNum.slice(0, 4)}...${cleanCardNum.slice(-4)}`);
      return res.status(400).json({
        success: false,
        message: 'Número de cartão de crédito inválido. Por favor, confira os números digitados.'
      });
    }

    // 2. Processamento Real na API do Asaas (Sandbox / Produção)
    const apiKey = process.env.ASAAS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Chave de API do Asaas não configurada no servidor.'
      });
    }

    // Criar/Obter Cliente no Asaas
    const customerRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAsaasHeaders(),
      body: JSON.stringify({
        name: guestName,
        email: guestEmail,
        cpfCnpj: guestCpf
      })
    });
    const customer = await customerRes.json();

    if (customer.errors) {
      console.error('[ASAAS CLIENTE ERRO]:', customer.errors);
      return res.status(400).json({
        success: false,
        message: customer.errors[0]?.description || 'Erro ao cadastrar dados do comprador no Asaas.'
      });
    }

    const paymentPayload = {
      customer: customer.id,
      billingType: 'CREDIT_CARD',
      value: parseFloat(amount),
      dueDate: new Date().toISOString().split('T')[0],
      description: `Presente de Casamento: ${giftTitle}`,
      creditCard: {
        holderName: cardHolderName,
        number: cleanCardNum,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        ccv: ccv
      },
      creditCardHolderInfo: {
        name: guestName,
        email: guestEmail,
        cpfCnpj: guestCpf,
        postalCode: '01001000',
        addressNumber: '100',
        phone: '11999999999'
      }
    };

    if (parseInt(installments) > 1) {
      paymentPayload.installmentCount = parseInt(installments);
    }

    const paymentRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: getAsaasHeaders(),
      body: JSON.stringify(paymentPayload)
    });
    const paymentData = await paymentRes.json();

    console.log('[ASAAS COBRANÇA RESPOSTA]:', paymentData.status, paymentData.errors || '');

    if (paymentData.errors) {
      const errMsg = paymentData.errors[0]?.description || 'Transação recusada pela operadora do cartão.';
      return res.status(400).json({ success: false, message: errMsg, errors: paymentData.errors });
    }

    if (paymentData.status === 'REFUSED' || paymentData.status === 'DECLINED') {
      return res.status(400).json({
        success: false,
        message: 'Cartão de crédito recusado pela operadora. Verifique os dados ou tente outro cartão.'
      });
    }

    return res.json({
      success: true,
      paymentId: paymentData.id,
      status: paymentData.status,
      message: 'Pagamento via Cartão de Crédito aprovado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao processar Cartão Asaas:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar pagamento via cartão.' });
  }
});

// 4. Receptor Oficial de Webhook do Asaas (Recepção de notificações de pagamento)
app.post('/api/asaas/webhook', async (req, res) => {
  const asaasToken = req.headers['asaas-access-token'];
  const expectedSecret = process.env.ASAAS_WEBHOOK_SECRET;

  // Validação opcional de Token de Segurança se configurado no Asaas
  if (expectedSecret && asaasToken && asaasToken !== expectedSecret) {
    console.warn(`⚠️ [ASAAS WEBHOOK] Tentativa de acesso não autorizada. Token inválido: ${asaasToken}`);
    return res.status(401).json({ error: 'Token de autenticação inválido.' });
  }

  const { event, payment } = req.body;
  console.log(`[ASAAS WEBHOOK RECEBIDO] Evento: ${event} | ID Cobrança: ${payment?.id} | Valor: R$ ${payment?.value}`);

  switch (event) {
    case 'PAYMENT_RECEIVED':
    case 'PAYMENT_CONFIRMED':
      console.log(`✅ [WEBHOOK] Pagamento confirmado com sucesso para ${payment?.description || 'Presente'}!`);
      
      let guestPhone = null;
      let guestName = 'Amigo(a)';
      let giftTitle = payment?.description || 'Presente de Casamento';

      // 1. Atualizar status no Firestore para PAID e buscar dados salvos
      try {
        if (db && payment?.id) {
          const giftDocRef = db.collection('gifts').doc(payment.id);
          const docSnap = await giftDocRef.get();
          
          if (docSnap.exists) {
            const giftData = docSnap.data();
            guestPhone = giftData.guestPhone || giftData.phone;
            guestName = giftData.guestName || guestName;
            giftTitle = giftData.giftTitle || giftTitle;
          }

          await giftDocRef.set({
            status: 'PAID',
            paidAt: FieldValue.serverTimestamp()
          }, { merge: true });
          
          console.log(`[FIRESTORE] Presente atualizado para PAID: ${payment.id}`);
        }
      } catch (fsErr) {
        console.error('[FIRESTORE ERRO] Falha ao atualizar presente para PAID:', fsErr);
      }
      
      // 2. Buscar dados do cliente no Asaas se o telefone não estava no Firestore
      if (!guestPhone && payment?.customer && !payment.customer.includes('mock')) {
        try {
          const baseUrl = getAsaasBaseUrl();
          const customerRes = await fetch(`${baseUrl}/customers/${payment.customer}`, {
            headers: getAsaasHeaders()
          });
          if (customerRes.ok) {
            const customerData = await customerRes.json();
            if (customerData) {
              guestPhone = customerData.mobilePhone || customerData.phone;
              guestName = customerData.name || guestName;
            }
          }
        } catch (fetchErr) {
          console.warn('[WEBHOOK ASAAS FETCH] Falha ao buscar dados do cliente no Asaas:', fetchErr.message);
        }
      }

      // Se passado diretamente no payload (ex: simulação ou webhook mock)
      if (!guestPhone && payment?.guestPhone) {
        guestPhone = payment.guestPhone;
      }
      if (!guestName || guestName === 'Amigo(a)') {
        if (payment?.guestName) guestName = payment.guestName;
      }

      // 3. Disparo da Mensagem de Agradecimento pelo WhatsApp via Baileys
      if (guestPhone) {
        try {
          await sendGiftThankYouWhatsApp({
            phone: guestPhone,
            guestName,
            giftTitle,
            amount: payment?.value
          });
          console.log(`✅ [WHATSAPP SUCESSO]: Agradecimento enviado para ${guestPhone} (${guestName})!`);
        } catch (waErr) {
          console.error(`❌ [WHATSAPP ERRO] Falha ao enviar agradecimento para ${guestPhone}:`, waErr.message);
        }
      } else {
        console.warn(`⚠️ [WHATSAPP AVISO] Pagamento ${payment?.id} confirmado, mas nenhum número de WhatsApp foi encontrado para o convidado.`);
      }

      break;
    case 'PAYMENT_OVERDUE':
      console.log(`⚠️ [WEBHOOK] Cobrança vencida ID: ${payment?.id}`);
      break;
    default:
      console.log(`ℹ️ [WEBHOOK] Evento processado: ${event}`);
  }

  // O Asaas exige HTTP 200 imediato para considerar a entrega com sucesso e não interromper a fila
  res.status(200).json({ received: true });
});

// 5. Endpoint de Simulação de Webhook (Disparo de teste local)
app.post('/api/asaas/webhook/simulate', (req, res) => {
  const { 
    event = 'PAYMENT_CONFIRMED', 
    value = 350.00, 
    giftTitle = 'Jantar Romântico à Beira-Mar',
    guestName = 'Convidado de Teste',
    guestPhone = '11999999999'
  } = req.body;

  const mockWebhookPayload = {
    event,
    payment: {
      id: `pay_mock_${Date.now()}`,
      customer: 'cus_mock_123',
      value,
      netValue: value * 0.98,
      billingType: 'PIX',
      status: 'CONFIRMED',
      description: `Presente de Casamento: ${giftTitle}`,
      confirmedDate: new Date().toISOString(),
      guestPhone,
      guestName
    }
  };

  console.log(`[SIMULAÇÃO WEBHOOK] Disparando evento "${event}" localmente para ${guestPhone}...`);
  
  // Executa a lógica do webhook internamente
  app._router.handle({ method: 'POST', url: '/api/asaas/webhook', body: mockWebhookPayload, headers: { 'content-type': 'application/json' } }, res, () => {});
});

// ----------------------------------------------------
// WHATSAPP MANAGEMENT ENDPOINTS
// ----------------------------------------------------

app.get('/api/whatsapp/status', (req, res) => {
  const status = getWhatsAppStatus();
  res.json({ success: true, ...status });
});

app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    await initWhatsAppClient();
    const status = getWhatsAppStatus();
    res.json({ success: true, message: 'Inicializando WhatsApp...', ...status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    const result = await logoutWhatsApp();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/whatsapp/test', async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Número de telefone é obrigatório.' });
    }
    const text = message || '💍 *Mensagem de Teste do Casamento Ana Clara & Dener!* ✨\n\nConexão com o WhatsApp funcionando perfeitamente! 🤍';
    const result = await sendWhatsAppTextMessage(phone, text);
    res.json({ success: true, message: `Mensagem enviada com sucesso para ${phone}!`, messageId: result?.key?.id });
  } catch (err) {
    console.error('[WHATSAPP TEST ERRO]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// ----------------------------------------------------
// OTHER APP ENDPOINTS (RSVP, Recados e Admin)
// ----------------------------------------------------

// Admin Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'anaedener28-11') return next();
  return res.status(401).json({ success: false, message: 'Não autorizado' });
};

// Admin Login
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === 'anaedener28-11') {
    res.json({ success: true, token: 'anaedener28-11' });
  } else {
    res.status(401).json({ success: false });
  }
});

// Admin Get Messages
app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
  if (!db) return res.json({ success: false, messages: [] });
  try {
    const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, messages: msgs });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Admin Get RSVPs
app.get('/api/admin/rsvps', authenticateAdmin, async (req, res) => {
  if (!db) return res.json({ success: false, rsvps: [] });
  try {
    const snapshot = await db.collection('guests').get();
    const rsvps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, rsvps });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Admin Get Gifts
app.get('/api/admin/gifts', authenticateAdmin, async (req, res) => {
  if (!db) return res.json({ success: false, gifts: [] });
  try {
    const snapshot = await db.collection('gifts').get();
    const gifts = snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAtFormatted = 'Data Indisponível';
      let paidAtFormatted = null;

      try {
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            createdAtFormatted = data.createdAt.toDate().toLocaleString('pt-BR');
          } else if (data.createdAt._seconds) {
            createdAtFormatted = new Date(data.createdAt._seconds * 1000).toLocaleString('pt-BR');
          } else {
            createdAtFormatted = new Date(data.createdAt).toLocaleString('pt-BR');
          }
        }
        if (data.paidAt) {
          if (typeof data.paidAt.toDate === 'function') {
            paidAtFormatted = data.paidAt.toDate().toLocaleString('pt-BR');
          } else if (data.paidAt._seconds) {
            paidAtFormatted = new Date(data.paidAt._seconds * 1000).toLocaleString('pt-BR');
          } else {
            paidAtFormatted = new Date(data.paidAt).toLocaleString('pt-BR');
          }
        }
      } catch (e) {}

      return {
        id: doc.id,
        ...data,
        createdAtFormatted,
        paidAtFormatted
      };
    });

    res.json({ success: true, gifts });
  } catch(err) {
    console.error('[ADMIN GIFTS ERRO]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Add Guest Code
app.post('/api/admin/guests', authenticateAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'DB offline' });
  const { code, name } = req.body;
  try {
    await db.collection('guests').doc(code).set({ code, name, confirmed: false });
    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Admin Bulk Add Guests (Gerador de Códigos em Massa)
app.post('/api/admin/guests/bulk', authenticateAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'Banco de dados offline.' });
  const { guests } = req.body; // Array de { name, code? } ou string de nomes
  if (!guests || !Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ success: false, message: 'Lista de convidados inválida.' });
  }

  try {
    const batch = db.batch();
    const createdGuests = [];

    // Busca convidados existentes no banco para garantir que não haverá duplicados
    const existingSnapshot = await db.collection('guests').get();
    const existingCodes = new Set(existingSnapshot.docs.map(doc => doc.id.toUpperCase()));

    let indexCount = 101;
    for (const g of guests) {
      const name = (typeof g === 'string' ? g : (g.name || '')).trim();
      if (!name) continue;

      let code = (typeof g === 'object' && g.code ? g.code : '').trim().toUpperCase();

      if (!code) {
        // Gera código limpo baseado no primeiro nome (Ex: MARIANA-101, CARLOS-102)
        const cleanName = name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .trim()
          .toUpperCase()
          .split(/\s+/)[0] || 'CONVITE';

        let candidateCode = `${cleanName}-${indexCount}`;
        while (existingCodes.has(candidateCode)) {
          indexCount++;
          candidateCode = `${cleanName}-${indexCount}`;
        }
        code = candidateCode;
        indexCount++;
      }

      existingCodes.add(code);
      const docRef = db.collection('guests').doc(code);
      batch.set(docRef, { code, name, confirmed: false });
      createdGuests.push({ code, name });
    }

    await batch.commit();
    console.log(`✅ [ADMIN BULK GUESTS] ${createdGuests.length} convites gerados e salvos com sucesso.`);

    res.json({
      success: true,
      count: createdGuests.length,
      createdGuests
    });
  } catch (err) {
    console.error('[ADMIN BULK GUESTS ERRO]:', err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar convites em massa: ' + err.message });
  }
});

// RSVP Verify Code
app.post('/api/rsvp/verify', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'DB offline' });
  try {
    const doc = await db.collection('guests').doc(req.body.code).get();
    if (doc.exists) {
      res.json({ success: true, guest: doc.data() });
    } else {
      res.status(404).json({ success: false, message: 'Código inválido.' });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// RSVP Confirm
app.post('/api/rsvp', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'DB offline' });
  try {
    await db.collection('guests').doc(req.body.code).update({
      guestName: req.body.guestName,
      totalGuests: parseInt(req.body.totalGuests) || 1,
      message: req.body.message,
      confirmed: true,
      confirmedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Presença confirmada com sucesso! Mal podemos esperar para celebrar com você.' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao confirmar presença.' });
  }
});

// Get Public Messages
app.get('/api/messages', async (req, res) => {
  if (!db) return res.json({ success: false, messages: [] });
  try {
    // Buscamos todas ordenadas e filtramos na memória para evitar a necessidade de criar Composite Index no Firebase para o MVP
    const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const msgs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(msg => msg.isPublic !== false); // Remove as ocultas

    res.json({ success: true, messages: msgs });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Post Message (Public or Private)
app.post('/api/messages', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'DB offline' });
  try {
    const { author, relationship, text, isPublic } = req.body;
    if (!author || !text) return res.status(400).json({ success: false });

    const msg = {
      author,
      relationship: relationship || 'Convidado Querido',
      text,
      isPublic: isPublic !== false, // default true
      date: new Date().toLocaleDateString('pt-BR'),
      createdAt: FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('messages').add(msg);
    res.json({ success: true, message: { id: docRef.id, ...msg } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Condicional para não dar erro de porta na Vercel (onde é serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor do Casamento rodando em http://localhost:${PORT}`);
  });
}

// Exportar para a Vercel
export default app;
