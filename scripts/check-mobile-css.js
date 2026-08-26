import fs from 'fs';

const css = fs.readFileSync('./public/assets/canva/e0aa6fb3a4613e86.ltr.css', 'utf8');

// Search for media queries in CSS
const mediaQueries = [...css.matchAll(/@media[^{]+\{/g)].map(m => m[0]);
console.log('Media Queries in Canva CSS:');
console.log([...new Set(mediaQueries)]);

// Let's check viewport meta tag and CSS zoom/transform in convite.html
const html = fs.readFileSync('./public/convite.html', 'utf8');
const metaViewport = html.match(/<meta[^>]*viewport[^>]*>/i);
console.log('\nMeta Viewport:', metaViewport ? metaViewport[0] : 'None');
