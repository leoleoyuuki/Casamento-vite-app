import fs from 'fs';

const rawHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const htmlOnly = rawHtml.replace(/^Title:[\s\S]*?---\s*\n+/i, '');

let modifiedHtml = htmlOnly
  .replace(/_assets\//g, '/assets/canva/')
  .replace(/window\['__canva_public_path__'\]\s*=\s*'_assets\/'/g, "window['__canva_public_path__'] = '/assets/canva/'");

const fontStyles = `
<style>
/* Fontes Oficiais do Canva com seus identificadores exatos */
@font-face {
  font-family: 'YAEz2L9phwY,0';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'YAEz2L9phwY';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Sloop Script Pro';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'YAFdJhX-538,0';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'YAFdJhX-538';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'YACgEZ1cb1Q,0';
  src: url('/assets/canva/fonts/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff'),
       url('/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'YACgEZ1cb1Q';
  src: url('/assets/canva/fonts/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff'),
       url('/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

/* Ajustes de overflow para impedir cortes ou sobreposição */
body, html {
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Evitar quebras de linha indevidas nas frases principais */
span, div, p {
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
}
</style>
`;

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

modifiedHtml = modifiedHtml
  .replace('</head>', fontStyles + '</head>')
  .replace('</body>', injectionScript + '</body>');

fs.writeFileSync('./public/convite.html', modifiedHtml, 'utf8');
console.log('Successfully injected explicit @font-face rules into public/convite.html!');
