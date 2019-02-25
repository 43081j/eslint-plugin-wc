const config = {
  extends: ['plugin:wc/recommended'],
  plugins: ['wc'],

  rules: {
    'attach-shadow-constructor': 'error',
    'guard-super-call': 'error',
    'no-closed-shadow-root': 'error',
    'no-typos': 'error'
  }
};

export default config;
