import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // 1. Import the polyfill handler

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Only include buffer to keep your production bundle small and fast
      include: ['buffer'], 
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})