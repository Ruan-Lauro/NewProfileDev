import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import articlesAdmin from './plugins/articlesAdmin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), articlesAdmin()],
  assetsInclude: ["**/*.glb"],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    watch: {
      // Salvar artigo/enviar arquivo não deve recarregar a página do editor.
      ignored: ["**/public/content/**", "**/public/uploads/**"],
    },
  },
})
