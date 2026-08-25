import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('--- Page.A ---');
console.log(JSON.stringify(data.page.A.A, null, 2).slice(0, 2000));

console.log('\n--- Page.d (Documents / Layers) ---');
console.log(Object.keys(data.page.A.d || {}));
for (const [k, v] of Object.entries(data.page.A.d || {})) {
  console.log(`Doc ${k}:`, Object.keys(v || {}));
}
