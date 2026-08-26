import fs from 'fs';

const js = fs.readFileSync('./public/assets/canva/c9146cc91354b619.js', 'utf8');

const idx = js.indexOf('FontFace(');
console.log('Context around FontFace:');
console.log(js.slice(Math.max(0, idx - 400), idx + 600));
