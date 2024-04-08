import type {ESLint} from 'eslint';

export const config: ESLint.ConfigData = {
  extends: ['plugin:wc/recommended'],
  plugins: ['wc'],

  rules: {
    'wc/attach-shadow-constructor': 'error',
    'wc/guard-super-call': 'error',
    'wc/no-child-traversal-in-attributechangedcallback': 'error',
    'wc/no-child-traversal-in-connectedcallback': 'error',
    'wc/no-closed-shadow-root': 'error',
    'wc/no-constructor-params': 'error',
    'wc/no-customized-built-in-elements': 'error',
    'wc/no-invalid-extends': 'error',
    'wc/no-typos': 'error',
    'wc/require-listener-teardown': 'error'
  }
};
