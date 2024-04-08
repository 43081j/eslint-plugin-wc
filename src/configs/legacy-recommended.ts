import type {ESLint} from 'eslint';

export const config: ESLint.ConfigData = {
  plugins: ['wc'],

  rules: {
    'wc/no-constructor-attributes': 'error',
    'wc/no-invalid-element-name': 'error',
    'wc/no-self-class': 'error'
  }
};
