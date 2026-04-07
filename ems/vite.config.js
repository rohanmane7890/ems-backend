import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    port: 5173,
    strictPort: true,
    hmr: true, // Let Vite detect the HMR settings automatically
    origin: 'https://nexgen-employee-ems.loca.lt', // Ensure assets load from the tunnel URL
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
