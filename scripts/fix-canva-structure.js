import fs from 'fs';
import path from 'path';

const canvaDir = './public/assets/canva';
const subdirs = ['fonts', 'media', 'images', 'audio'];

// Create subdirectories
subdirs.forEach(sub => {
  const dir = path.join(canvaDir, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Read all files in canvaDir
const files = fs.readdirSync(canvaDir);

files.forEach(file => {
  const fullPath = path.join(canvaDir, file);
  if (fs.statSync(fullPath).isFile()) {
    // If it's a woff/woff2 file, copy to fonts/
    if (file.endsWith('.woff') || file.endsWith('.woff2')) {
      fs.copyFileSync(fullPath, path.join(canvaDir, 'fonts', file));
    }
    // If it's an image/media, copy to media/ and images/
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      fs.copyFileSync(fullPath, path.join(canvaDir, 'media', file));
      fs.copyFileSync(fullPath, path.join(canvaDir, 'images', file));
    }
    // If it's audio, copy to audio/
    if (file.endsWith('.m4a') || file.endsWith('.mp3')) {
      fs.copyFileSync(fullPath, path.join(canvaDir, 'audio', file));
    }
  }
});

console.log('All Canva assets synchronized across subfolders!');
