import recommended from './configs/recommended';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noInvalidElementName from './rules/no-invalid-element-name';
import noSelfClass from './rules/no-self-class';

export const rules = {
  'no-constructor-attributes': noConstructorAttrs,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-invalid-element-name': noInvalidElementName,
  'no-self-class': noSelfClass
};

export const configs = {
  recommended
};
