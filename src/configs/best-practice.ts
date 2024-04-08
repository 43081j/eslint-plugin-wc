import type {ESLint, Linter} from 'eslint';
import {configFactory as recommendedFactory} from './recommended.js';

export const configFactory = (plugin: ESLint.Plugin): Linter.FlatConfig => {
  const base = recommendedFactory(plugin);
  return {
    ...base,
    rules: {
      ...base.rules,
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
};
