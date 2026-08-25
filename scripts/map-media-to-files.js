import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Look for media metadata in data.page.A
const mediaMap = {};

function scanMedia(o) {
  if (!o || typeof o !== 'object') return;
  if (typeof o.A === 'string' && (o.A.startsWith('MAH') || o.A.startsWith('EAG') || o.A.startsWith('TAG'))) {
    mediaMap[o.A] = o;
  }
  for (const v of Object.values(o)) {
    scanMedia(v);
  }
}

scanMedia(data);
console.log('Media IDs count:', Object.keys(mediaMap).length);
console.log(JSON.stringify(mediaMap, null, 2).slice(0, 3000));
