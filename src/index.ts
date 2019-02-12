import recommended from './configs/recommended';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noClosedShadowRoot from './rules/no-closed-shadow-root';

export const rules = {
  'no-constructor-attributes': noConstructorAttrs,
  'no-closed-shadow-root': noClosedShadowRoot
};

export const configs = {
  recommended
};
