import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5188,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5189',
        changeOrigin: true
      }
    }
  }
})
