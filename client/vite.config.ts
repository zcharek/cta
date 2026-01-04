import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisations pour le SEO et les performances
    rollupOptions: {
      output: {
        // Séparation des chunks pour un meilleur caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          framer: ['framer-motion'],
          router: ['wouter'],
        },
      },
    },
    // Compression pour réduire la taille des fichiers
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Génération de source maps pour le debugging
    sourcemap: false,
  },
  // Optimisations pour le développement
  server: {
    port: 5173,
    host: true,
  },
  // Préchargement des ressources critiques
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'wouter'],
  },
}) 