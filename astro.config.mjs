// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false
    }), 
    react()
  ],
  vite: {
    server: {
      hmr: false
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'animation-vendor': ['motion', 'gsap'],
            '3d-vendor': ['three', 'ogl']
          }
        }
      }
    },
    ssr: {
      noExternal: ['three', 'ogl']
    }
  },
  server: {
    port: 4321,
    host: 'localhost'
  },
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    format: 'file'
  },
  compressHTML: true
});
