import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    cors: true,
    hmr: {
      host: 'nexgen-employee.loca.lt',
      protocol: 'wss'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
