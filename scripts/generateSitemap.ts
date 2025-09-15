import { writeFileSync } from 'fs';

const base = process.env.SITE_URL || 'https://example.com';
const staticRoutes = ['/', '/portfolio', '/blog'];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  staticRoutes.map(r => `\n  <url><loc>${base}${r}</loc></url>`).join('') +
  '\n</urlset>\n';

writeFileSync('dist/sitemap.xml', xml);
console.log('Sitemap generated.');
