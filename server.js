import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { Resend } from 'resend';
import { getThankYouEmailTemplate } from './services/emailTemplate.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';

dotenv.config();

// Configuração do Firebase Admin (Segurança para Vercel)
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Na Vercel, usaremos a variável de ambiente (colar o JSON lá)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Localmente, usamos o arquivo
  serviceAccount = JSON.parse(fs.readFileSync('./casamento-vite-app-firebase-adminsdk-fbsvc-b29810b662.json', 'utf8'));
}

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { giftTitle, amount, guestName, guestEmail, guestCpf } = req.body;
    
    console.log(`[ASAAS PIX] Gerando PIX para ${guestName} - Presente: ${giftTitle} (R$ ${amount})`);
    
    // Se houver chave API válida no Asaas
    if (process.env.ASAAS_API_KEY) {
      // 1. Criar Cliente
      const customerRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: getAsaasHeaders(),
        body: JSON.stringify({
          name: guestName || 'Convidado Casamento',
          email: guestEmail || 'convidado@exemplo.com',
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
    const { giftTitle, amount, guestName, guestEmail, guestCpf } = req.body;
    console.log(`[ASAAS CHECKOUT HOSPEDADO] Gerando checkout para presente "${giftTitle}" (R$ ${amount}) - Convidado: ${guestName}`);

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
      await db.collection('gifts').doc(paymentData.id).set({
        paymentId: paymentData.id,
        giftTitle: giftTitle,
        amount: parseFloat(amount),
        guestName: guestName || 'Amigo(a)',
        guestEmail: guestEmail || '',
        guestCpf: finalCpf,
        status: 'PENDING',
        createdAt: FieldValue.serverTimestamp()
      });
      console.log(`[FIRESTORE] Presente PENDING registrado: ${paymentData.id}`);
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
      
      // Atualizar status no Firestore para PAID
      try {
        if (payment?.id) {
          await db.collection('gifts').doc(payment.id).update({
            status: 'PAID',
            paidAt: FieldValue.serverTimestamp()
          });
          console.log(`[FIRESTORE] Presente atualizado para PAID: ${payment.id}`);
        }
      } catch (fsErr) {
        console.error('[FIRESTORE ERRO] Falha ao atualizar presente para PAID:', fsErr);
      }
      
      // Enviar e-mail de agradecimento aos convidados
      try {
        let guestEmail = 'leoyuuki2005@gmail.com'; // O Resend requer este email no Sandbox
        let guestName = 'Amigo(a)';
        
        // Buscar os detalhes do cliente direto do Asaas
        if (payment?.customer && !payment.customer.includes('mock')) {
          try {
            const baseUrl = getAsaasBaseUrl();
            const customerRes = await fetch(`${baseUrl}/customers/${payment.customer}`, {
              headers: getAsaasHeaders()
            });
            if (customerRes.ok) {
              const customerData = await customerRes.json();
              if (customerData && customerData.email) {
                guestEmail = customerData.email;
                guestName = customerData.name || 'Amigo(a)';
              }
            }
          } catch (fetchErr) {
            console.warn('[WEBHOOK ASAAS FETCH] Falha ao buscar dados do cliente no Asaas:', fetchErr.message);
          }
        }
        
        // Disparo do E-mail pelo Resend (onboarding@resend.dev é usado em modo teste)
        const { data, error } = await resend.emails.send({
          from: 'Casamento Ana e Dener <onboarding@resend.dev>',
          to: [guestEmail],
          subject: 'Recebemos o seu presente! 💖',
          html: getThankYouEmailTemplate(guestName, payment?.description || 'Nosso Presente', payment?.value),
        });

        if (error) {
          console.error('[RESEND ERRO]:', error);
        } else {
          console.log(`✅ [RESEND SUCESSO]: E-mail enviado para ${guestEmail} (ID: ${data?.id})`);
        }
      } catch (err) {
        console.error('[RESEND CATCH ERRO] Falha ao disparar e-mail:', err);
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
  const { event = 'PAYMENT_CONFIRMED', value = 350.00, giftTitle = 'Jantar Romântico à Beira-Mar' } = req.body;

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
      confirmedDate: new Date().toISOString()
    }
  };

  console.log(`[SIMULAÇÃO WEBHOOK] Disparando evento "${event}" localmente...`);
  
  // Executa a lógica do webhook internamente
  app._router.handle({ method: 'POST', url: '/api/asaas/webhook', body: mockWebhookPayload, headers: { 'content-type': 'application/json' } }, res, () => {});
});

// ----------------------------------------------------
// OTHER APP ENDPOINTS (RSVP & Recados)
// ----------------------------------------------------

app.post('/api/rsvp', (req, res) => {
  const { code, guestName, totalGuests, message } = req.body;
  if (!code || !guestName) {
    return res.status(400).json({ success: false, message: 'Código e nome são obrigatórios.' });
  }

  const rsvp = {
    id: rsvpStore.length + 1,
    code,
    guestName,
    totalGuests: parseInt(totalGuests) || 1,
    message,
    confirmedAt: new Date().toISOString()
  };

  rsvpStore.push(rsvp);
  console.log('[RSVP CONFIRMADO]:', rsvp);

  res.json({ success: true, message: 'Presença confirmada com sucesso! Mal podemos esperar para celebrar com você.' });
});

app.get('/api/messages', (req, res) => {
  res.json({ success: true, messages: messageStore });
});

app.post('/api/messages', (req, res) => {
  const { author, relationship, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ success: false, message: 'Nome e mensagem são obrigatórios.' });
  }

  const newMessage = {
    id: messageStore.length + 1,
    author,
    relationship: relationship || 'Convidado Querido',
    date: new Date().toLocaleDateString('pt-BR'),
    text
  };

  messageStore.unshift(newMessage);
  res.json({ success: true, message: newMessage });
});

// Condicional para não dar erro de porta na Vercel (onde é serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor do Casamento rodando em http://localhost:${PORT}`);
  });
}

// Exportar para a Vercel
export default app;
