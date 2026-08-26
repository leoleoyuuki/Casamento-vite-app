import fs from 'fs';

const js1 = fs.readFileSync('./public/assets/canva/c9146cc91354b619.js', 'utf8');
const js2 = fs.readFileSync('./public/assets/canva/125ffa419580c0dd.vendor.js', 'utf8');
const js3 = fs.readFileSync('./public/assets/canva/7a3f3bd12e6aee13.runtime.js', 'utf8');

// Find occurrences of FontFace or font-family or font loading in js
function searchJS(str, name) {
  const matches = [...str.matchAll(/FontFace\([^)]+\)/g)].map(m => m[0]);
  console.log(`FontFace in ${name}:`, matches.slice(0, 10));

  const fontFamilies = [...str.matchAll(/fontFamily\s*:\s*["'][^"']+["']/g)].map(m => m[0]);
  console.log(`fontFamily in ${name}:`, fontFamilies.slice(0, 10));

  const fontFaceRules = [...str.matchAll(/@font-face[^{]*\{[^}]+\}/g)].map(m => m[0]);
  console.log(`@font-face in ${name}:`, fontFaceRules.slice(0, 10));
}

searchJS(js1, 'c9146cc91354b619.js');
searchJS(js2, '125ffa419580c0dd.vendor.js');
searchJS(js3, '7a3f3bd12e6aee13.runtime.js');
