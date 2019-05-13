import * as ESTree from 'estree';
import {AST} from 'eslint';

export interface DecoratorNode extends ESTree.BaseNode {
  type: 'Decorator';
  expression: ESTree.Expression;
}

export type WithDecorators<T extends ESTree.Node> = T & {
  decorators?: DecoratorNode[];
};

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
 * @param {ESTree.Node} node Node to test
 * @param {AST.Token=} jsdoc JSDoc to parse
 * @return {boolean}
 */
export function isCustomElement(
  node: ESTree.Node,
  jsdoc?: AST.Token | null
): node is ESTree.Class {
  const asDecorated = node as WithDecorators<ESTree.Node>;

  if (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') {
    if (
      node.superClass &&
      node.superClass.type === 'Identifier' &&
      node.superClass.name === 'HTMLElement'
    ) {
      return true;
    }

    if (
      jsdoc !== undefined &&
      jsdoc !== null &&
      jsdoc.value.includes('@customElement')
    ) {
      return true;
    }

    if (
      asDecorated.decorators !== undefined &&
      asDecorated.decorators.some(isCustomElementDecorator)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Determines if a node is an extension of HTMLElement class or not.
 *
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function isNativeCustomElement(node: ESTree.Node): node is ESTree.Class {
  return (
    (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') &&
    node.superClass !== undefined &&
    node.superClass !== null &&
    node.superClass.type === 'Identifier' &&
    node.superClass.name === 'HTMLElement'
  );
}
