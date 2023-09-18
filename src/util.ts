import * as ESTree from 'estree';
import {Rule} from 'eslint';

export interface DecoratorNode extends ESTree.BaseNode {
  type: 'Decorator';
  expression: ESTree.Expression;
}

export type WithDecorators<T extends ESTree.Node> = T & {
  decorators?: DecoratorNode[];
};

const customElementsCache = new WeakMap<ESTree.Node, boolean>();

/**
 * Determines if a given decorator is the `@customElement` decorator
 *
 * @param {DecoratorNode} node Decorator to test
 * @return {boolean}
 */
export function isCustomElementDecorator(node: DecoratorNode): boolean {
  return (
    (node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' &&
      node.expression.callee.name === 'customElement') ||
    (node.expression.type === 'Identifier' &&
      node.expression.name === 'customElement')
  );
}

const knownModuleBaseClasses = new Map<string, Set<string>>([
  ['lit', new Set(['LitElement'])]
]);

/**
 * Retrieves the configured element base class list
 *
 * @param {Rule.RuleContext} context ESLint rule context
 * @return {string[]}
 */
export function getElementBaseClasses(context: Rule.RuleContext): string[] {
  const bases = new Set<string>(['HTMLElement']);

  for (const [moduleName, moduleClasses] of knownModuleBaseClasses) {
    try {
      require.resolve(moduleName, {paths: [context.cwd]});

      for (const moduleClass of moduleClasses) {
        bases.add(moduleClass);
      }
    } catch (_err) {
      // do nothing, lit didn't exist
    }
  }

  if (Array.isArray(context.settings.wc?.elementBaseClasses)) {
    const configuredBases = context.settings.wc.elementBaseClasses as string[];
    for (const base of configuredBases) {
      bases.add(base);
    }
  }

  return [...bases];
}

/**
 * Determines if a node is an element class or not.
 *
 * @param {Rule.RuleContext} context ESLint rule context
 * @param {ESTree.Class} node Node to test
 * @param {AST.Token=} jsdoc JSDoc to parse
 * @return {boolean}
 */
export function isCustomElement(
  context: Rule.RuleContext,
  node: ESTree.Class,
  jsdoc?: ESTree.Comment | null
): boolean {
  const asDecorated = node as WithDecorators<ESTree.Node>;
  const customElementBases = getElementBaseClasses(context);
  const cached = customElementsCache.get(node);

  if (cached !== undefined) {
    return cached;
  }

  if (
    node.superClass?.type === 'Identifier' &&
    customElementBases.includes(node.superClass.name)
  ) {
    customElementsCache.set(node, true);
    return true;
  }

  if (jsdoc?.value.includes('@customElement')) {
    customElementsCache.set(node, true);
    return true;
  }

  if (asDecorated.decorators?.some(isCustomElementDecorator)) {
    customElementsCache.set(node, true);
    return true;
  }

  customElementsCache.set(node, false);
  return false;
}

/**
 * Determines if a node is an extension of HTMLElement class or not.
 *
 * @param {ESTree.Class} node Node to test
 * @return {boolean}
 */
export function isNativeCustomElement(node: ESTree.Class): boolean {
  return (
    node.superClass?.type === 'Identifier' &&
    node.superClass.name === 'HTMLElement'
  );
}

/**
 * Converts a literal-or-array value to an array value
 * @param {unknown} val Value to convert
 * @return {Array<unknown>}
 */
export function coerceArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
