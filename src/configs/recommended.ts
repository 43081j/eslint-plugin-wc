const config = {
  plugins: ['wc'],
  parserOptions: {
    sourceType: 'module'
  },

  rules: {
    'wc/no-constructor-attributes': 'error',
    'wc/no-invalid-element-name': 'error',
    'wc/no-self-class': 'error'
  }
};

export default config;
