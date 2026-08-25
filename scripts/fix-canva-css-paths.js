import fs from 'fs';

const cssFiles = [
  './public/assets/canva/e0aa6fb3a4613e86.ltr.css',
  './public/assets/canva/static_font_4.ltr.css'
];

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const updated = content
      .replace(/url\(\s*['"]?_assets\//g, 'url("/assets/canva/')
      .replace(/url\(\s*['"]?fonts\//g, 'url("/assets/canva/')
      .replace(/url\(\s*['"]?media\//g, 'url("/assets/canva/');
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated CSS paths in ${file}`);
  }
});
