import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8081/';

export default defineConfig({
  plugins: [react(), svgr()],
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
      '@axonivy/form-editor': resolve(import.meta.dirname, '../../packages/editor/src'),
      '@axonivy/form-editor-protocol': resolve(import.meta.dirname, '../../packages/protocol/src'),
      '@axonivy/form-editor-core': resolve(import.meta.dirname, '../../packages/core/src')
    }
  },
  base: './'
});
