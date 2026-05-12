import { defineConfig } from 'eslint/config';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default defineConfig(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    name: 'eslint-plugin-i18next',
    plugins: { i18next },
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          mode: 'jsx-only',
          'jsx-attributes': { include: ['label', 'aria-label', 'title', 'name'] }
        }
      ]
    }
  },
  {
    name: 'packages/core',
    files: ['packages/core/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    name: 'ignore-files',
    ignores: ['**/i18next.config.*']
  }
);
