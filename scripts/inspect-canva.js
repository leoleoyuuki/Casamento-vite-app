import fs from 'fs';

const content = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');

// Find bootstrap JSON
const match = content.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\((['"`])([\s\S]*?)\1\);/);
if (match) {
  try {
    // Evaluating the string literal to get the raw unescaped JSON string
    const jsonStr = eval(match[0].replace("window['bootstrap'] = JSON.parse(", "").slice(0, -2));
    const data = JSON.parse(jsonStr);
    console.log('--- CANVA SITE METADATA ---');
    console.log('Title:', data.page?.A?.D);
    console.log('Dimensions:', data.page?.A?.C);
    
    fs.writeFileSync('./scripts/canva-dump.json', JSON.stringify(data, null, 2));
    console.log('Saved parsed data to scripts/canva-dump.json');
  } catch (e) {
    console.error('Error parsing JSON:', e.message);
  }
} else {
  console.log('Could not find window.bootstrap match');
}
