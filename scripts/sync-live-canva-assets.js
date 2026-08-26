import fs from 'fs';
import https from 'https';
import path from 'path';

// Get full content from step 811
const fullHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/811/content.md', 'utf8')
  .replace(/^Title:[\s\S]*?---\s*\n+/i, '');

// Extract all asset paths from the live HTML
const assetMatches = [...fullHtml.matchAll(/_assets\/([a-zA-Z0-9_\-\.\/]+)/g)].map(m => m[1]);
const uniqueAssets = [...new Set(assetMatches)];

console.log(`Found ${uniqueAssets.length} unique assets in live Canva page:`);
console.log(uniqueAssets);

const baseUrl = 'https://anaclaraedener123.my.canva.site/_assets/';

async function downloadAsset(asset) {
  const localPath = path.join('./public/assets/canva', asset.replace(/^images\//, '').replace(/^fonts\//, '').replace(/^media\//, ''));
  const targetDir = path.dirname(localPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const url = baseUrl + asset;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`[OK] ${asset} -> ${localPath} (${fs.statSync(localPath).size} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`[FAIL ${res.statusCode}] ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[ERR] ${url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const asset of uniqueAssets) {
    await downloadAsset(asset);
  }
}

run();
