import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8081/';

export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rolldownOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: {
    port: 3000,
    proxy: {
      '/dev-workflow-ui': {
        target: ENGINE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@axonivy/form-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/form-editor-protocol': resolve(__dirname, '../../packages/protocol/src'),
      '@axonivy/form-editor-core': resolve(__dirname, '../../packages/core/src')
    }
  },
  base: './'
});
