import fs from 'fs';
import path from 'path';
import https from 'https';

const raw = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const assetPaths = [...new Set([...raw.matchAll(/_assets\/[^"'\s>)]+/g)].map(m => m[0]))];

const targetDir = './public/assets/canva';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Status ${response.statusCode} for ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Downloading ${assetPaths.length} assets from Canva site...`);
  for (const aPath of assetPaths) {
    const fullUrl = `https://anaclaraedener123.my.canva.site/${aPath}`;
    const filename = path.basename(aPath);
    const dest = path.join(targetDir, filename);
    try {
      await downloadFile(fullUrl, dest);
      console.log(`✓ Downloaded: ${filename}`);
    } catch (err) {
      console.error(`✗ Failed ${filename}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

downloadAll();
