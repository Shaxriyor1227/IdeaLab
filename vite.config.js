import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react-icons')) {
              return 'react-icons';
            }
            if (id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
