import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Swap this with your actual GitHub Codespaces backend URL
        target: 'https://github.dev',
        changeOrigin: true,
        secure: false // Required to handle HTTPS routing in dev environments
      }
    }
  }
})
