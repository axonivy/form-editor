import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.production.json' }), svgr()],
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'editor',
      formats: ['es']
    },
    rolldownOptions: {
      external: [
        '@axonivy/ui-components',
        '@axonivy/ui-icons',
        '@dnd-kit/core',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
        'i18next',
        'react-i18next',
        'react',
        'react-error-boundary',
        'react/jsx-runtime',
        'react-dom'
      ]
    }
  },
  test: {
    dir: 'src',
    include: ['**/*.test.ts?(x)'],
    alias: {
      'test-utils': resolve(__dirname, 'src/test-utils/test-utils.tsx'),
      '@axonivy/form-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.tsx'],
    css: false,
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
