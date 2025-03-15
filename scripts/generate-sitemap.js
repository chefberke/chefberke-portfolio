const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://berkekanber.com';
const pages = [
  '',
  '/projects',
  '/skills',
  '/setup',
  '/contact',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(page => `
    <url>
      <loc>${DOMAIN}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('')}
</urlset>`;

const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${DOMAIN}

# Sitemaps
Sitemap: ${DOMAIN}/sitemap.xml`;

// Ensure the dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write sitemap
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log('Generated sitemap.xml');

// Write robots.txt
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
console.log('Generated robots.txt');
