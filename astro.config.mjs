// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// Deve corrispondere a `site.url` in src/config/site.ts
const SITE_URL = 'https://www.mdaimpresaedile.it'

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Il CSS di una landing page singola sta in un file solo: evita
    // una richiesta di rete in piu sul critical path.
    inlineStylesheets: 'auto',
  },
  image: {
    // Formati moderni per le immagini processate da Astro
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  compressHTML: true,
})
