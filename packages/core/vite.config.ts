import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'core',
      formats: ['es']
    },
    rolldownOptions: {
      external: ['@axonivy/jsonrpc']
    }
  }
});
