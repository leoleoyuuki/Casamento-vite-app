import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('=== Canva Fonts in dump.page.B ===');
dump.page.B.forEach((f, i) => {
  console.log(`[${i}] ID: ${f.A}, Title: ${f.C}, Files:`, f.D?.map(d => ({ style: d.style, url: d.files?.[0]?.url })));
});

console.log('=== Canva Fonts in dump.page.I.A ===');
dump.page.I?.A?.forEach((f, i) => {
  console.log(`[${i}] ID: ${f.A}, Title: ${f.C}, Files:`, f.D?.map(d => ({ style: d.style, url: d.files?.[0]?.url })));
});
