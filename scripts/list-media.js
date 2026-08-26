import fs from 'fs';

const mediaDir = './public/assets/canva/media';
const files = fs.readdirSync(mediaDir);

console.log('Files in media dir:');
files.forEach(f => {
  const stat = fs.statSync(`${mediaDir}/${f}`);
  console.log(`${f} (${stat.size} bytes)`);
});
