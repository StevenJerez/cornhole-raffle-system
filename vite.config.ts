import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/ifa2026/',
  server: {
    proxy: {
      '/ifa2026/api': {
        target: 'http://localhost:8789',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8789',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
