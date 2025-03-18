import type {ESLint} from 'eslint';
import attachShadowConstructor from './rules/attach-shadow-constructor.js';
import defineTagAfterClassDef from './rules/define-tag-after-class-definition.js';
import exposeClassOnGlobal from './rules/expose-class-on-global.js';
import filenameMatches from './rules/file-name-matches-element.js';
import guardDefine from './rules/guard-define-call.js';
import guardSuperCall from './rules/guard-super-call.js';
import maxElementsPerFile from './rules/max-elements-per-file.js';
import noChildInAttrChange from './rules/no-child-traversal-in-attributechangedcallback.js';
import noChildInConnected from './rules/no-child-traversal-in-connectedcallback.js';
import noClosedShadowRoot from './rules/no-closed-shadow-root.js';
import noConstructor from './rules/no-constructor.js';
import noConstructorAttrs from './rules/no-constructor-attributes.js';
import noConstructorParams from './rules/no-constructor-params.js';
import noCustomizedBuiltInElements from './rules/no-customized-built-in-elements.js';
import noExports from './rules/no-exports-with-element.js';
import noInvalidElementName from './rules/no-invalid-element-name.js';
import noInvalidExtends from './rules/no-invalid-extends.js';
import noOnPrefix from './rules/no-method-prefixed-with-on.js';
import noSelfClass from './rules/no-self-class.js';
import noTypos from './rules/no-typos.js';
import {configFactory as configRecommended} from './configs/recommended.js';
import {configFactory as configBestPractice} from './configs/best-practice.js';
import {config as configLegacyRecommended} from './configs/legacy-recommended.js';
import {config as configLegacyBestPractice} from './configs/legacy-best-practice.js';
import requireListenerTeardown from './rules/require-listener-teardown.js';
import tagMatchesClass from './rules/tag-name-matches-class.js';

export const rules = {
  'attach-shadow-constructor': attachShadowConstructor,
  'define-tag-after-class-definition': defineTagAfterClassDef,
  'expose-class-on-global': exposeClassOnGlobal,
  'file-name-matches-element': filenameMatches,
  'guard-define-call': guardDefine,
  'guard-super-call': guardSuperCall,
  'max-elements-per-file': maxElementsPerFile,
  'no-child-traversal-in-attributechangedcallback': noChildInAttrChange,
  'no-child-traversal-in-connectedcallback': noChildInConnected,
  'no-closed-shadow-root': noClosedShadowRoot,
  'no-constructor': noConstructor,
  'no-constructor-attributes': noConstructorAttrs,
  'no-constructor-params': noConstructorParams,
  'no-customized-built-in-elements': noCustomizedBuiltInElements,
  'no-exports-with-element': noExports,
  'no-invalid-element-name': noInvalidElementName,
  'no-invalid-extends': noInvalidExtends,
  'no-method-prefixed-with-on': noOnPrefix,
  'no-self-class': noSelfClass,
  'no-typos': noTypos,
  'require-listener-teardown': requireListenerTeardown,
  'tag-name-matches-class': tagMatchesClass
};

const plugin: ESLint.Plugin = {rules};

export const configs = {
  recommended: configLegacyRecommended,
  'best-practice': configLegacyBestPractice,
  'flat/recommended': configRecommended(plugin),
  'flat/best-practice': configBestPractice(plugin)
};
