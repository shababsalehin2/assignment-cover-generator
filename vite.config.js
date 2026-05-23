import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Change 'base' to your GitHub repo name for GitHub Pages deployment
// e.g., base: '/assignment-cover-generator/'
export default defineConfig({
  plugins: [react()],
  // base: '/assignment-cover-generator/',
    base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['jspdf', 'html2canvas'],
          docx: ['docx', 'file-saver'],
        }
      }
    }
  }
})
