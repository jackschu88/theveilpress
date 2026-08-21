import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  adapter: vercel(),
  site: 'https://www.theveilpress.com',
  security: {
    allowedDomains: [
      { hostname: 'theveilpress.com', protocol: 'https' },
      { hostname: 'www.theveilpress.com', protocol: 'https' },
    ],
  },
  server: {
    port: 5180,
  },
  redirects: {
    '/presale': '/library/founders',
    '/presale/executive': '/library/founders',
    '/presale/executive/thank-you': '/library/founders/thank-you',
    '/books': '/library',
    '/books/square-mile': '/library/veil',
    '/books/square-mile/companion': '/library/map',
    '/books/square-mile/companion/print': '/library/map',
    '/books/square-mile/companion/ebook': '/library/map',
    '/books/square-mile/checkout/full': '/library/checkout/full',
    '/books/square-mile/checkout/print-companion': '/library/checkout/print-companion',
  },
  vite: {
    server: {
      strictPort: true,
    },
    preview: {
      port: 5180,
      strictPort: true,
    },
  },
});
