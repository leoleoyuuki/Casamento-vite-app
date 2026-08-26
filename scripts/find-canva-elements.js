import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

function findElementByText(obj, text) {
  for (const k in obj) {
    const val = obj[k];
    if (typeof val === 'object' && val !== null) {
      if (JSON.stringify(val).includes(text)) {
        console.log(`Found "${text}" at key:`, k);
        console.log(JSON.stringify(val, null, 2));
      }
    }
  }
}

findElementByText(dump.page, 'Nossa hist');
findElementByText(dump.page, 'esperamos');
findElementByText(dump.page, 'O local');
