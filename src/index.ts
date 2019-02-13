import recommended from './configs/recommended';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noInvalidElementName from './rules/no-invalid-element-name';

export const rules = {
  'no-constructor-attributes': noConstructorAttrs,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-invalid-element-name': noInvalidElementName
};

export const configs = {
  recommended
};
