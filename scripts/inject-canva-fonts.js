import fs from 'fs';

const rawHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const htmlOnly = rawHtml.replace(/^Title:[\s\S]*?---\s*\n+/i, '');

let modifiedHtml = htmlOnly
  .replace(/_assets\//g, '/assets/canva/')
  .replace(/window\['__canva_public_path__'\]\s*=\s*'_assets\/'/g, "window['__canva_public_path__'] = '/assets/canva/'");

const fontPreloads = `
  <link rel="preload" href="/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff" as="font" type="font/woff" crossorigin="anonymous">
  <link rel="preload" href="/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff" as="font" type="font/woff" crossorigin="anonymous">
  <link rel="preload" href="/assets/canva/fonts/834f64ff415fb8f4f5d92d8fd40507e9.woff" as="font" type="font/woff" crossorigin="anonymous">
  <link rel="preload" href="/assets/canva/fonts/b07201e0e9fc452103c1c0345b0e7c1d.woff" as="font" type="font/woff" crossorigin="anonymous">
`;

const fontStyles = `
<style>
/* Fontes Oficiais do Canva com seus identificadores exatos */
@font-face {
  font-family: 'YAEz2L9phwY,0';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAEz2L9phwY';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Sloop Script Pro';
  src: url('/assets/canva/fonts/003e82bf2f68067801da6a72d24cdf78.woff') format('woff'),
       url('/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAFdJhX-538,0';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAFdJhX-538';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/assets/canva/fonts/77fbf36c56a33ec9d32065083bba3023.woff') format('woff'),
       url('/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YACgEZ1cb1Q,0';
  src: url('/assets/canva/fonts/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff'),
       url('/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YACgEZ1cb1Q';
  src: url('/assets/canva/fonts/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff'),
       url('/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

/* Prevenção de corte e sobreposição mobile */
body, html {
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Evitar sobreposição de linhas em títulos script */
span, div, p, text {
  text-rendering: geometricPrecision;
}

@media (max-width: 768px) {
  /* No mobile, permitir que caixas de texto com script respirem para não encavalar */
  span {
    word-break: normal !important;
  }
}
</style>
`;

const injectionScript = `
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('convite') || urlParams.get('code') || urlParams.get('c') || '';

  // Interceptar cliques para direcionar ao site
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

  // Forçar recálculo perfeito de layout no mobile após carregamento das fontes
  if (document.fonts) {
    document.fonts.ready.then(function() {
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
      }, 500);
    });
  }
})();
</script>
`;

modifiedHtml = modifiedHtml
  .replace('<head>', '<head>' + fontPreloads)
  .replace('</head>', fontStyles + '</head>')
  .replace('</body>', injectionScript + '</body>');

fs.writeFileSync('./public/convite.html', modifiedHtml, 'utf8');
console.log('Successfully updated public/convite.html with mobile & font-display block rules!');
