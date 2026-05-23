import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // FIXED: Rewritten from an Object to a Function for Vite 8 / Rolldown compatibility
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
            if (id.includes('docx') || id.includes('file-saver')) {
              return 'docx';
            }
          }
        }
      }
    }
  }
})