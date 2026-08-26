import fs from 'fs';

// Read all font files to base64
const fonts = {
  '834f64ff415fb8f4f5d92d8fd40507e9.woff': fs.readFileSync('./public/assets/canva/834f64ff415fb8f4f5d92d8fd40507e9.woff').toString('base64'),
  '0803f40e19a074a5520c2746a6ba3c95.woff': fs.readFileSync('./public/assets/canva/0803f40e19a074a5520c2746a6ba3c95.woff').toString('base64'),
  'b07201e0e9fc452103c1c0345b0e7c1d.woff': fs.readFileSync('./public/assets/canva/b07201e0e9fc452103c1c0345b0e7c1d.woff').toString('base64'),
  '711f50b3a8c00bb7e2e05ef85f982cb6.woff': fs.readFileSync('./public/assets/canva/711f50b3a8c00bb7e2e05ef85f982cb6.woff').toString('base64'),
  '003e82bf2f68067801da6a72d24cdf78.woff': fs.readFileSync('./public/assets/canva/003e82bf2f68067801da6a72d24cdf78.woff').toString('base64'),
  '77fbf36c56a33ec9d32065083bba3023.woff': fs.readFileSync('./public/assets/canva/77fbf36c56a33ec9d32065083bba3023.woff').toString('base64')
};

const rawHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');
const htmlOnly = rawHtml.replace(/^Title:[\s\S]*?---\s*\n+/i, '');

let modifiedHtml = htmlOnly
  .replace(/_assets\//g, '/assets/canva/')
  .replace(/window\['__canva_public_path__'\]\s*=\s*'_assets\/'/g, "window['__canva_public_path__'] = '/assets/canva/'")
  .replace(/https:\/\/casamento-vite-app\.vercel\.app/g, '/');

// Replace font URLs in the JSON bootstrap data with base64 Data URIs
for (const [filename, base64] of Object.entries(fonts)) {
  const dataUri = `data:font/woff;charset=utf-8;base64,${base64}`;
  
  // Replace in bootstrap JSON string
  const regex1 = new RegExp(`/assets/canva/fonts/${filename}`, 'g');
  const regex2 = new RegExp(`_assets/fonts/${filename}`, 'g');
  const regex3 = new RegExp(`/assets/canva/${filename}`, 'g');
  
  modifiedHtml = modifiedHtml.replace(regex1, dataUri);
  modifiedHtml = modifiedHtml.replace(regex2, dataUri);
  modifiedHtml = modifiedHtml.replace(regex3, dataUri);
}

const embeddedFontStyles = `
<style>
/* Fontes Oficiais Embutidas em Base64 */
@font-face {
  font-family: 'YAEz2L9phwY,0';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['003e82bf2f68067801da6a72d24cdf78.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAEz2L9phwY';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['003e82bf2f68067801da6a72d24cdf78.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Sloop Script Pro';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['003e82bf2f68067801da6a72d24cdf78.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAFdJhX-538,0';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['77fbf36c56a33ec9d32065083bba3023.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YAFdJhX-538';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['77fbf36c56a33ec9d32065083bba3023.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['77fbf36c56a33ec9d32065083bba3023.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YACgEZ1cb1Q,0';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['834f64ff415fb8f4f5d92d8fd40507e9.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'YACgEZ1cb1Q';
  src: url(data:font/woff;charset=utf-8;base64,${fonts['834f64ff415fb8f4f5d92d8fd40507e9.woff']}) format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

body, html {
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

span, div, p, text {
  text-rendering: geometricPrecision;
}
</style>
`;

const injectionScript = `
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('convite') || urlParams.get('code') || urlParams.get('c') || '';
  const targetHref = code ? '/?convite=' + encodeURIComponent(code) + '#rsvp' : '/#rsvp';

  function updateLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(a => {
      const text = (a.innerText || a.textContent || '').trim().toLowerCase();
      const href = a.getAttribute('href') || '';
      
      if (text.includes('site') || text.includes('confirmar') || text.includes('história') || href.includes('casamento-vite-app') || href === '/') {
        a.setAttribute('href', targetHref);
        a.setAttribute('target', '_top');
      }
    });
  }

  updateLinks();
  const observer = new MutationObserver(updateLinks);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('click', function(e) {
    const target = e.target.closest('a') || e.target;
    const text = (target.innerText || target.textContent || '').trim().toLowerCase();
    const href = target.getAttribute ? target.getAttribute('href') : '';
    
    if (text.includes('site') || text.includes('confirmar') || (href && (href.includes('casamento-vite-app') || href === '/'))) {
      e.preventDefault();
      e.stopPropagation();
      window.top.location.href = targetHref;
    }
  }, true);

  if (document.fonts) {
    document.fonts.ready.then(function() {
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        updateLinks();
      }, 50);
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        updateLinks();
      }, 300);
    });
  }
})();
</script>
`;

modifiedHtml = modifiedHtml
  .replace('</head>', embeddedFontStyles + '</head>')
  .replace('</body>', injectionScript + '</body>');

fs.writeFileSync('./public/convite.html', modifiedHtml, 'utf8');
console.log('Injected Base64 fonts directly into window.bootstrap and @font-face! Total length:', modifiedHtml.length);
