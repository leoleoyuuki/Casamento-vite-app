import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Extract elements inside the page
const elements = data.page?.A?.c?.A || {};

console.log('Total Root Elements:', Object.keys(elements).length);

const results = [];
for (const [id, elem] of Object.entries(elements)) {
  const name = elem.A || 'Unnamed';
  const bounds = elem.C || {};
  const innerTexts = [];
  
  // Find inner text or images
  function scan(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.A && Array.isArray(obj.A) && obj.A.every(x => typeof x === 'string')) {
      obj.A.forEach(t => innerTexts.push(t.replace(/\\n|\n/g, ' ')));
    }
    for (const v of Object.values(obj)) {
      scan(v);
    }
  }
  scan(elem);
  
  results.push({
    id,
    name,
    bounds: {
      top: bounds.A,
      left: bounds.B,
      width: bounds.D,
      height: bounds.C,
      rotation: bounds.E
    },
    texts: innerTexts.filter(Boolean)
  });
}

console.log(JSON.stringify(results.slice(0, 30), null, 2));
