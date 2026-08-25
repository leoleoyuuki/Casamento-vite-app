import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Search data for font family definitions or hashes
const str = JSON.stringify(data);
const fontHashes = [...str.matchAll(/[a-f0-9]{32}\.woff/g)].map(m => m[0]);
console.log('Font WOFFs in JSON:', [...new Set(fontHashes)]);

// Search for font aliases
const fontAliases = [...str.matchAll(/YA[a-zA-Z0-9_-]+/g)].map(m => m[0]);
console.log('Font Aliases in JSON:', [...new Set(fontAliases)]);
