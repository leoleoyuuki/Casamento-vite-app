import fs from 'fs';

const html = fs.readFileSync('./public/convite.html', 'utf8');

// Find all occurrences of fonts/ or .woff in convite.html
const fontUrls = [...html.matchAll(/"url"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Font URLs inside window.bootstrap / HTML:');
console.log(fontUrls);
