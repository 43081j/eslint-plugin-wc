import attachShadowConstructor from './rules/attach-shadow-constructor';
import bestPractice from './configs/best-practice';
import guardSuperCall from './rules/guard-super-call';
import maxElementsPerFile from './rules/max-elements-per-file';
import noChildInAttrChange from './rules/no-child-traversal-in-attributechangedcallback';
import noChildInConnected from './rules/no-child-traversal-in-connectedcallback';
import noClosedShadowRoot from './rules/no-closed-shadow-root';
import noConstructor from './rules/no-constructor';
import noConstructorAttrs from './rules/no-constructor-attributes';
import noConstructorParams from './rules/no-constructor-params';
import noCustomizedBuiltInElements from './rules/no-customized-built-in-elements';
import noInvalidElementName from './rules/no-invalid-element-name';
import noOnPrefix from './rules/no-method-prefixed-with-on';
import noSelfClass from './rules/no-self-class';
import noTypos from './rules/no-typos';
import recommended from './configs/recommended';
import requireListenerTeardown from './rules/require-listener-teardown';
import tagMatchesClass from './rules/tag-name-matches-class';

export const rules = {
  'attach-shadow-constructor': attachShadowConstructor,
  'guard-super-call': guardSuperCall,
  'max-elements-per-file': maxElementsPerFile,
  'no-child-traversal-in-attributechangedcallback': noChildInAttrChange,
  'no-child-traversal-in-connectedcallback': noChildInConnected,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-constructor': noConstructor,
  'no-constructor-attributes': noConstructorAttrs,
  'no-constructor-params': noConstructorParams,
  'no-customized-built-in-elements': noCustomizedBuiltInElements,
  'no-invalid-element-name': noInvalidElementName,
  'no-method-prefixed-with-on': noOnPrefix,
  'no-self-class': noSelfClass,
  'no-typos': noTypos,
  'require-listener-teardown': requireListenerTeardown,
  'tag-name-matches-class': tagMatchesClass
};

export const configs = {
  recommended,
  'best-practice': bestPractice
};
