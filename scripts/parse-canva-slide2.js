import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

console.log('Total A.A items:', data.page.A.A.length);

data.page.A.A.forEach((item, aIdx) => {
  console.log(`\n================= A.A[${aIdx}] =================`);
  const slides = item.t || [];
  slides.forEach((slide, sIdx) => {
    console.log(`\n  --- SLIDE ${sIdx + 1} (ID: ${slide.a}) ---`);
    console.log('  Background:', slide.D);
    console.log('  Total Elements:', slide.E.length);
    
    slide.E.forEach((el, elIdx) => {
      const texts = [];
      const images = [];
      const links = [];
      
      function findStuff(o) {
        if (!o || typeof o !== 'object') return;
        if (o.A && Array.isArray(o.A) && o.A.every(x => typeof x === 'string')) {
          o.A.forEach(t => texts.push(t.replace(/\\n|\n/g, ' ')));
        }
        if (o['A?'] === 'd' && o.A) {
          images.push(o.A);
        }
        if (o.url || o.href || o.link) {
          links.push(o.url || o.href || o.link);
        }
        for (const v of Object.values(o)) {
          findStuff(v);
        }
      }
      findStuff(el);
      
      console.log(`    [El ${elIdx + 1}] Type: ${el['A?']}, ID: ${el._}, Pos: (${Math.round(el.B)}, ${Math.round(el.A)}), Size: ${Math.round(el.D)}x${Math.round(el.C)}, Rot: ${el.E}°`);
      if (texts.length) console.log(`      Texts: ${texts.join(' | ')}`);
      if (images.length) console.log(`      Images: ${images.join(', ')}`);
      if (links.length) console.log(`      Links: ${links.join(', ')}`);
    });
  });
});
