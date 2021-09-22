const config = {
  extends: ['plugin:wc/recommended'],
  plugins: ['wc'],

  rules: {
    'wc/attach-shadow-constructor': 'error',
    'wc/guard-super-call': 'error',
    'wc/no-closed-shadow-root': 'error',
    'wc/no-constructor-params': 'error',
    'wc/no-typos': 'error',
    'wc/require-listener-teardown': 'error'
  }
};

export default config;
