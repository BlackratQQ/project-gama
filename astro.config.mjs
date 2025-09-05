// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      hmr: false
    }
  },
  server: {
    port: 4321,
    host: 'localhost'
  }
});
