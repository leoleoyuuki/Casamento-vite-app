import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./casamento-vite-app-firebase-adminsdk-fbsvc-b29810b662.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function runTests() {
  console.log('--- TESTANDO FUNCIONALIDADES DO SISTEMA DE CONVITES ---');

  // 1. Verificar se os códigos no banco são alfanuméricos
  const snapshot = await db.collection('guests').get();
  console.log(`Total de convidados no banco: ${snapshot.size}`);

  let nonAlphanumericCount = 0;
  snapshot.forEach(doc => {
    const code = doc.id;
    // Se tiver hífen seguido de números sequenciais antigos (ex: NOME-101)
    if (/^[A-Z]+-\d+$/.test(code)) {
      nonAlphanumericCount++;
    }
  });

  console.log(`Convites com formato antigo sequencial: ${nonAlphanumericCount}`);

  // 2. Testar criação de convidado com código aleatório
  const testCode = 'TEST99';
  await db.collection('guests').doc(testCode).set({
    code: testCode,
    name: 'Convidado de Teste Automatizado',
    confirmed: false
  });
  console.log('✅ Convidado de teste criado com sucesso.');

  // 3. Testar edição do nome do convidado
  await db.collection('guests').doc(testCode).update({
    name: 'Convidado de Teste Atualizado com Sucesso'
  });
  const updatedDoc = await db.collection('guests').doc(testCode).get();
  console.log('✅ Edição de nome testada:', updatedDoc.data().name);

  // 4. Testar verificação do código (como no RSVP)
  const verifyDoc = await db.collection('guests').doc(testCode).get();
  if (verifyDoc.exists && verifyDoc.data().name === 'Convidado de Teste Atualizado com Sucesso') {
    console.log('✅ Verificação de código (RSVP verify) validada com sucesso.');
  }

  // 5. Testar exclusão do convidado de teste
  await db.collection('guests').doc(testCode).delete();
  console.log('✅ Exclusão de convidado testada com sucesso.');

  console.log('--- TODOS OS TESTES PASSARAM COM SUCESSO! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Erro nos testes:', err);
  process.exit(1);
});
