import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('=== CANVA STRUCTURE ANALYSIS ===');

// Extract all pages
const pages = data.page?.A?.J?.A || [];
console.log(`Total Pages / Sections: ${pages.length}`);

// Extract all text strings
const allStrings = [];
function findStrings(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(findStrings);
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'A' && Array.isArray(v) && v.every(item => typeof item === 'string')) {
      v.forEach(str => {
        const clean = str.replace(/\\n|\n/g, ' ').trim();
        if (clean && clean.length > 1 && !allStrings.includes(clean)) {
          allStrings.push(clean);
        }
      });
    }
    findStrings(v);
  }
}

findStrings(data);
console.log('\n--- EXTRACTED TEXT CONTENT ---');
allStrings.forEach((s, idx) => {
  console.log(`${idx + 1}. ${s}`);
});

// Extract all image / asset URLs or hashes
const imageHashes = [];
const rawStr = JSON.stringify(data);
const matches = rawStr.match(/[a-f0-9]{32}/g) || [];
console.log('\n--- FOUND ASSET HASHES ---');
console.log([...new Set(matches)]);
