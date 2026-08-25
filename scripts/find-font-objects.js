import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

function findKey(o, target, path = '') {
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'string' && v.includes(target)) {
      console.log(`Found "${target}" at ${path}.${k}:`, v);
      console.log('Parent Object:', JSON.stringify(o, null, 2).slice(0, 500));
    }
    findKey(v, target, path ? `${path}.${k}` : k);
  }
}

findKey(data, '834f64ff415fb8f4f5d92d8fd40507e9');
findKey(data, '0803f40e19a074a5520c2746a6ba3c95');
findKey(data, 'b07201e0e9fc452103c1c0345b0e7c1d');
findKey(data, '711f50b3a8c00bb7e2e05ef85f982cb6');
findKey(data, '003e82bf2f68067801da6a72d24cdf78');
findKey(data, '77fbf36c56a33ec9d32065083bba3023');
