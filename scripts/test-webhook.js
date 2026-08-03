// Script de teste local para simular disparos de Webhook do Asaas

const WEBHOOK_URL = 'http://localhost:3001/api/asaas/webhook';

const sampleEvents = [
  {
    event: 'PAYMENT_RECEIVED',
    payment: {
      id: 'pay_00998877665544',
      customer: 'cus_000005544332',
      value: 350.00,
      netValue: 343.00,
      billingType: 'PIX',
      status: 'RECEIVED',
      description: 'Presente de Casamento: Jantar Romântico à Beira-Mar',
      paymentDate: new Date().toISOString().split('T')[0]
    }
  },
  {
    event: 'PAYMENT_CONFIRMED',
    payment: {
      id: 'pay_00998877665544',
      customer: 'cus_000005544332',
      value: 850.00,
      netValue: 833.00,
      billingType: 'CREDIT_CARD',
      installmentCount: 8,
      status: 'CONFIRMED',
      description: 'Presente de Casamento: Geladeira Inox Smart French Door',
      confirmedDate: new Date().toISOString()
    }
  }
];

async function runWebhookTest() {
  console.log('🚀 Iniciando teste de disparo de Webhook Asaas...\n');

  for (const payload of sampleEvents) {
    console.log(`📡 Enviando evento de teste: ${payload.event}...`);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'asaas-access-token': 'whsec_E_YIiBGW-NjCoxk5Y58wtWcexRHb0X0mVzdJq8twzV0'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(`✅ Resposta do servidor: Status ${response.status}`, data);
    } catch (err) {
      console.error(`❌ Erro ao enviar webhook para ${WEBHOOK_URL}:`, err.message);
    }
    console.log('------------------------------------------------');
  }
}

runWebhookTest();
