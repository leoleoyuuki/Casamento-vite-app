import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('./public/assets/canva').filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

console.log('--- CANVA IMAGE FILES ---');
files.forEach(file => {
  const filePath = `./public/assets/canva/${file}`;
  const buffer = fs.readFileSync(filePath);
  const size = (buffer.length / 1024).toFixed(1);
  
  // Simple PNG dimension reader
  let dim = 'Unknown';
  if (file.endsWith('.png') && buffer.length > 24) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    dim = `${width}x${height}`;
  }
  console.log(`${file}: ${size} KB | ${dim}`);
});
