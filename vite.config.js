import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    strictPort: true, // This will make Vite fail if the port is taken instead of trying another port
    host: true, // This enables listening on all network interfaces
    open: true  // This will open the browser automatically
  }
}) 