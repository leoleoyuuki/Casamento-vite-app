import fs from 'fs';

const rawHtml = fs.readFileSync('C:/Users/leo yuuki/.gemini/antigravity/brain/34841dac-b549-4959-b53d-ad41780f79c2/.system_generated/steps/264/content.md', 'utf8');

// Strip markdown header if present
const htmlOnly = rawHtml.replace(/^Title:[\s\S]*?---\s*\n+/i, '');

// Replace asset paths _assets/ -> /assets/canva/
let modifiedHtml = htmlOnly
  .replace(/_assets\//g, '/assets/canva/')
  .replace(/href="_assets\//g, 'href="/assets/canva/')
  .replace(/src="_assets\//g, 'src="/assets/canva/')
  .replace(/window\['__canva_public_path__'\]\s*=\s*'_assets\/'/g, "window['__canva_public_path__'] = '/assets/canva/'");

// Inject interactive link routing (so clicking the RSVP or Site button carries ?convite=CODIGO)
const injectionScript = `
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('convite') || urlParams.get('code') || urlParams.get('c') || '';

  // Intercept click on Canva links to redirect to site with code
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a') || e.target;
    const text = (target.innerText || target.textContent || '').trim().toLowerCase();
    
    if (text.includes('site') || text.includes('história') || text.includes('local') || text.includes('confirmar')) {
      if (text.includes('site') || text.includes('confirmar')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = code ? '/?convite=' + encodeURIComponent(code) + '#rsvp' : '/#rsvp';
      }
    }
  }, true);
})();
</script>
`;

modifiedHtml = modifiedHtml.replace('</body>', injectionScript + '</body>');

fs.writeFileSync('./public/convite.html', modifiedHtml, 'utf8');
console.log('Created public/convite.html successfully! Size:', modifiedHtml.length);
