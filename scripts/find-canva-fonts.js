import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Find font definitions in data
console.log('Font definitions in dump:');
function scanFonts(o, path = '') {
  if (!o || typeof o !== 'object') return;
  if (o.fontFamily || o.family || (o.C && typeof o.C === 'string' && o.C.includes('YAF'))) {
    console.log(`Path: ${path}`, o);
  }
  for (const [k, v] of Object.entries(o)) {
    scanFonts(v, path ? `${path}.${k}` : k);
  }
}

scanFonts(data);
