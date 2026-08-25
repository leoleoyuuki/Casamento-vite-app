import fs from 'fs';
import path from 'path';

const canvaDir = './public/assets/canva';
const subdirs = ['images', 'fonts', 'media', 'audio'];

subdirs.forEach(sub => {
  const dirPath = path.join(canvaDir, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Copy all files into their subdirectories as well
const files = fs.readdirSync(canvaDir, { withFileTypes: true })
  .filter(d => !d.isDirectory())
  .map(d => d.name);

files.forEach(file => {
  const src = path.join(canvaDir, file);
  subdirs.forEach(sub => {
    const dest = path.join(canvaDir, sub, file);
    fs.copyFileSync(src, dest);
  });
});

console.log(`Copied ${files.length} assets into all Canva subdirectories.`);

// Rebuild convite.html
const rawHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const htmlOnly = rawHtml.replace(/^Title:[\s\S]*?---\s*\n+/i, '');

let modifiedHtml = htmlOnly
  .replace(/_assets\//g, '/assets/canva/')
  .replace(/window\['__canva_public_path__'\]\s*=\s*'_assets\/'/g, "window['__canva_public_path__'] = '/assets/canva/'");

const injectionScript = `
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('convite') || urlParams.get('code') || urlParams.get('c') || '';

  document.addEventListener('click', function(e) {
    const target = e.target.closest('a') || e.target;
    const text = (target.innerText || target.textContent || '').trim().toLowerCase();
    
    if (text.includes('site') || text.includes('história') || text.includes('local') || text.includes('confirmar')) {
      if (text.includes('site') || text.includes('confirmar')) {
        e.preventDefault();
        e.stopPropagation();
        window.top.location.href = code ? '/?convite=' + encodeURIComponent(code) + '#rsvp' : '/#rsvp';
      }
    }
  }, true);
})();
</script>
`;

modifiedHtml = modifiedHtml.replace('</body>', injectionScript + '</body>');
fs.writeFileSync('./public/convite.html', modifiedHtml, 'utf8');
console.log('Rebuilt public/convite.html successfully.');
