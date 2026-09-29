import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      // En desarrollo, un título simple. En el build, el <head> completo (SEO,
      // Open Graph, precargas) lo genera scripts/prerender.mjs desde src/data/site.ts.
      name: 'album-dev-head',
      apply: 'serve',
      transformIndexHtml: (html) => html.replace('<!--album-head-->', '<title>Ale &amp; Pau · Our Memories</title>'),
    },
  ],
  css: {
    modules: {
      // Nombres cortos y estables (iguales en el render del servidor y del cliente).
      generateScopedName: 'ap-[local]-[hash:base64:5]',
    },
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
})
