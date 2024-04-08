import type {ESLint, Linter} from 'eslint';

export const configFactory = (plugin: ESLint.Plugin): Linter.FlatConfig => ({
  plugins: {
    wc: plugin
  },

  rules: {
    'wc/no-constructor-attributes': 'error',
    'wc/no-invalid-element-name': 'error',
    'wc/no-self-class': 'error'
  }
});
