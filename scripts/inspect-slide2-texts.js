import fs from 'fs';

const html = fs.readFileSync('./public/convite.html', 'utf8');

// Look for text element IDs or classes
const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));
const slide2 = data.page.A.A[1].t[0];

console.log('Slide 2 Elements with Texts:');
slide2.E.forEach(el => {
  if (el.a && el.a.C && el.a.C.A) {
    console.log(`Element ID: ${el._}, Position: (${el.B}, ${el.A}), Size: ${el.D}x${el.C}`);
    console.log(`  Text:`, el.a.C.A);
    console.log(`  Styles (C.0):`, el.a.C.C ? el.a.C.C[0] : 'None');
  }
});
