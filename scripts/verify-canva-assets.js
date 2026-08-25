import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('./public/convite.html', 'utf8');

// Find all /assets/canva/...
const matches = [...html.matchAll(/\/assets\/canva\/([a-zA-Z0-9._-]+)/g)].map(m => m[1]);
console.log(`Found ${matches.length} asset references in convite.html:`);

let missing = 0;
const checked = new Set();
matches.forEach(file => {
  if (checked.has(file)) return;
  checked.add(file);
  const exists = fs.existsSync(path.join('./public/assets/canva', file));
  if (!exists) {
    console.error(`❌ MISSING: ${file}`);
    missing++;
  } else {
    console.log(`✅ ${file}`);
  }
});

console.log(`\nVerification complete. Missing files: ${missing}`);
