import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    strictPort: true, // Force the specified port
    host: true, // This enables listening on all network interfaces
    open: true, // This will open the browser automatically
    cors: true, // Enable CORS
    force: true // Force the server to close any existing process
  },
  preview: {
    port: 4000,
    strictPort: true,
    host: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/' // Use root path for assets
}) 