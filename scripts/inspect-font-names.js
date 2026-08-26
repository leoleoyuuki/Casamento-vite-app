import fs from 'fs';

// Check font name in woff/ttf headers
function inspectWoff(file) {
  const buf = fs.readFileSync(file);
  const str = buf.toString('latin1');
  console.log(`=== Inspecting ${file} ===`);
  
  // Search for readable strings in font name table
  const names = [...str.matchAll(/[\x00-\x1F]?([A-Za-z0-9\s_-]{4,30})[\x00-\x1F]/g)]
    .map(m => m[1].trim())
    .filter(s => s.length > 3 && !s.includes('http') && !s.includes('xml'));
  
  console.log('Detected strings:', [...new Set(names)].slice(0, 15));
}

inspectWoff('./public/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff');
inspectWoff('./public/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff');
inspectWoff('./public/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff');
