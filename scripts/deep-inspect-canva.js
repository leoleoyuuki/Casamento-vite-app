import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Inspect page elements
const page = data.page?.A;
console.log('Page Keys:', Object.keys(page || {}));

// Let's find images, video, animations, shapes
const images = [];
const textBlocks = [];
const animations = [];

function inspect(obj, path = '') {
  if (!obj || typeof obj !== 'object') return;
  
  if (obj['A?'] === 'IMAGE' || obj.type === 'IMAGE' || (obj.url && typeof obj.url === 'string')) {
    images.push({ path, ...obj });
  }
  
  for (const [k, v] of Object.entries(obj)) {
    inspect(v, path ? `${path}.${k}` : k);
  }
}

inspect(data);
console.log('Total Images/Media found:', images.length);

// Let's dump all asset image URLs
const raw = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const assetUrls = [...raw.matchAll(/_assets\/[^"'\s>)]+/g)].map(m => m[0]);
console.log('Asset URLs found in HTML:', [...new Set(assetUrls)]);
