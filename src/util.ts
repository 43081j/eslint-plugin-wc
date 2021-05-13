import * as ESTree from 'estree';
import {AST, Rule} from 'eslint';

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
  jsdoc?: AST.Token | null
): boolean {
  const asDecorated = node as WithDecorators<ESTree.Node>;
  const customElementBases: string[] = ['HTMLElement'];
  const cached = customElementsCache.get(node);

  if (cached !== undefined) {
    return cached;
  }

  if (Array.isArray(context.settings.wc?.elementBaseClasses)) {
    customElementBases.push(
      ...(context.settings.wc.elementBaseClasses as string[])
    );
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
