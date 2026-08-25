import fs from 'fs';

const css = fs.readFileSync('./public/assets/canva/e0aa6fb3a4613e86.ltr.css', 'utf8');
const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('CSS Length:', css.length);

// Check classes and keyframes in css
const keyframes = [...css.matchAll(/@keyframes\s+([a-zA-Z0-9_-]+)/g)].map(m => m[1]);
console.log('Found Keyframes:', keyframes);

// List media files in public/assets/canva
const files = fs.readdirSync('./public/assets/canva');
console.log('\nDownloaded Canva files:');
files.forEach(f => {
  const stats = fs.statSync(`./public/assets/canva/${f}`);
  console.log(`- ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
});
