import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('=== PAGE.B (FONTS) ===');
console.log(JSON.stringify(data.page.B, null, 2));

console.log('\n=== PAGE.I.A (FONTS) ===');
console.log(JSON.stringify(data.page.I?.A, null, 2));
