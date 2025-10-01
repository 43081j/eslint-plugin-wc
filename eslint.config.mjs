import eslintjs from '@eslint/js';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    plugins: {
      eslint: eslintjs,
      typescript: tseslint
    },
    extends: [
      eslintjs.configs.recommended,
      tseslint.configs.strict
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {caughtErrorsIgnorePattern: '^_'}],
    }
  },
  {
    files: ['src/test/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      }
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
]);
