import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/canva-dump.json', 'utf8'));

// Check data.page.A.G
console.log('Page.G (Media Catalog):', JSON.stringify(data.page.A.G, null, 2));

// Check data.page.A.d or data.base
console.log('\nBase:', JSON.stringify(data.base, null, 2));
