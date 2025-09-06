// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from 'astro-icon';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }), 
    react(),
    icon({
      include: {
        'fa6-solid': ['*']
      }
    })
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
            // Separate WebGL components for lazy loading
            if (id.includes('LightRays') || id.includes('WebGL') || id.includes('3d')) {
              return 'webgl-effects';
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
  output: 'server',
  build: {
    inlineStylesheets: 'auto',
    format: 'file'
  },
  compressHTML: true
});
