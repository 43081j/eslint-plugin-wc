import recommended from './configs/recommended';
import attachShadowConstructor from './rules/attach-shadow-constructor';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noInvalidElementName from './rules/no-invalid-element-name';
import noSelfClass from './rules/no-self-class';

export const rules = {
  'attach-shadow-constructor': attachShadowConstructor,
  'no-constructor-attributes': noConstructorAttrs,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-invalid-element-name': noInvalidElementName,
  'no-self-class': noSelfClass
};

export const configs = {
  recommended
};
