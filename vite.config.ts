import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 8000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    // Prerender the site to static HTML so it ships as static files (no server
    // runtime) and deploys anywhere without SSR routing.
    tanstackStart({ prerender: { enabled: true } }),
    viteReact(),
  ],
})
