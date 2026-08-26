import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Extract all text elements in order
const textElements = [];

function extractTexts(node) {
  if (!node) return;
  if (node.a && node.a.C && node.a.C.A) {
    textElements.push({
      id: node._,
      text: node.a.C.A.join(''),
      font: node.a.C.C?.[0]?.C,
      fontSize: node.a.C.C?.[0]?.G,
      color: node.a.C.C?.[0]?.M,
      pos: { x: node.B, y: node.A, w: node.D, h: node.C },
      link: node.a?.url || node.a?.link
    });
  }
  if (Array.isArray(node)) node.forEach(extractTexts);
  else if (typeof node === 'object') {
    Object.values(node).forEach(extractTexts);
  }
}

extractTexts(dump.page);

console.log(`Found ${textElements.length} text elements in Canva invitation:`);
textElements.forEach((t, i) => {
  console.log(`[${i}] "${t.text.replace(/\n/g, ' ')}" | Font: ${t.font} | Size: ${t.fontSize} | Color: ${t.color}`);
});
