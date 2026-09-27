import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src/designer-child'),
    },
  },
  server: {
    proxy: {
      '/api/kidsbank': {
        target: 'http://127.0.0.1:8091',
        changeOrigin: true,
        rewrite: (rewritePath) => rewritePath.replace(/^\/api\/kidsbank/, ''),
      },
    },
  },
});
