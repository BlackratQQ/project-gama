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
          drop_debugger: true,
          passes: 2,
          pure_funcs: ['console.log', 'console.debug']
        },
        mangle: {
          safari10: true
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('gsap')) {
                return 'animation-vendor';
              }
              if (id.includes('three') || id.includes('ogl')) {
                return '3d-vendor';
              }
              if (id.includes('react-icons')) {
                return 'icons-vendor';
              }
            }
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
