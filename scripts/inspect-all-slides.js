import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('--- ALL KEYS IN PAGE ---');
for (const k of Object.keys(data.page.A)) {
  const val = data.page.A[k];
  console.log(`Key ${k}:`, Array.isArray(val) ? `Array(${val.length})` : typeof val);
}

// In Canva, J is usually the list of pages / layers or groups
console.log('\nPage.J:', JSON.stringify(data.page.A.J, null, 2));

// Let's check G or V or W
console.log('\nPage.V:', JSON.stringify(data.page.A.V, null, 2));
console.log('\nPage.W:', JSON.stringify(data.page.A.W, null, 2));
console.log('\nPage.Y:', JSON.stringify(data.page.A.Y, null, 2));
console.log('\nPage.a:', JSON.stringify(data.page.A.a, null, 2));
console.log('\nPage.b:', JSON.stringify(data.page.A.b, null, 2));
