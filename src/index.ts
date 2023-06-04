import attachShadowConstructor from './rules/attach-shadow-constructor';
import bestPractice from './configs/best-practice';
import guardSuperCall from './rules/guard-super-call';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noConstructor from './rules/no-constructor';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noConstructorParams from './rules/no-constructor-params';
import noInvalidElementName from './rules/no-invalid-element-name';
import noSelfClass from './rules/no-self-class';
import noTypos from './rules/no-typos';
import recommended from './configs/recommended';
import requireListenerTeardown from './rules/require-listener-teardown';

export const rules = {
  'attach-shadow-constructor': attachShadowConstructor,
  'guard-super-call': guardSuperCall,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-constructor': noConstructor,
  'no-constructor-attributes': noConstructorAttrs,
  'no-constructor-params': noConstructorParams,
  'no-invalid-element-name': noInvalidElementName,
  'no-self-class': noSelfClass,
  'no-typos': noTypos,
  'require-listener-teardown': requireListenerTeardown
};

export const configs = {
  recommended,
  'best-practice': bestPractice
};
