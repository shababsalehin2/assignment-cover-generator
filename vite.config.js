import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized configuration for Vite 8 & Vercel
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
    // Removed the manualChunks block entirely to let Rolldown handle chunking automatically
  }
})