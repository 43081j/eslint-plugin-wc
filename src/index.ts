import recommended from './configs/recommended';
import bestPractice from './configs/best-practice';
import attachShadowConstructor from './rules/attach-shadow-constructor';
import guardSuperCall from './rules/guard-super-call';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noInvalidElementName from './rules/no-invalid-element-name';
import noSelfClass from './rules/no-self-class';
import noTypos from './rules/no-typos';

export const rules = {
  'attach-shadow-constructor': attachShadowConstructor,
  'guard-super-call': guardSuperCall,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-constructor-attributes': noConstructorAttrs,
  'no-invalid-element-name': noInvalidElementName,
  'no-self-class': noSelfClass,
  'no-typos': noTypos
};

export const configs = {
  recommended,
  'best-practice': bestPractice
};
