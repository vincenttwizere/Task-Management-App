import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // Allow fallback to next available port
    host: true, // This enables listening on all network interfaces
    open: true, // This will open the browser automatically
    cors: true // Enable CORS
  },
  preview: {
    port: 5173,
    strictPort: false,
    host: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './' // This ensures assets are loaded correctly
}) 