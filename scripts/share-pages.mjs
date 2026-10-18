import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const works = JSON.parse(readFileSync('src/data/works.json', 'utf8'));
const media = JSON.parse(readFileSync('src/data/media.json', 'utf8'));
const covers = JSON.parse(readFileSync('src/data/covers.json', 'utf8'));
const template = readFileSync('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const domain = process.env.SITE_URL?.replace(/\/$/, '');
for (const work of works) {
  const title = `${work.title}｜黄爱美作品集`;
  const description = `${work.title}。我负责：${work.responsibilities.join('、')}。`;
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(description)}`);
  const shareImage = covers[work.id] ?? media[work.id]?.poster;
  if (shareImage) html = html.replace('</head>', `<meta property="og:image" content="${escape((domain ?? '') + shareImage)}" /></head>`);
  if (domain) html = html.replace('</head>', `<link rel="canonical" href="${escape(domain)}/works/${work.slug}" /><meta property="og:url" content="${escape(domain)}/works/${work.slug}" /></head>`);
  mkdirSync(`dist/works/${work.slug}`, { recursive: true });
  writeFileSync(`dist/works/${work.slug}/index.html`, html);
}
writeFileSync('dist/_redirects', '/* /index.html 200\n');
console.log(`已生成 ${works.length} 个作品分享页面。`);
