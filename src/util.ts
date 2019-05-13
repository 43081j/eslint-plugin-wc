import * as ESTree from 'estree';
import {AST} from 'eslint';

export interface DecoratorNode extends ESTree.BaseNode {
  type: 'Decorator';
  expression: ESTree.Expression;
}

export type WithDecorators<T extends ESTree.Node> = T & {
  decorators?: DecoratorNode[];
};

export type ChildNode<T extends ESTree.Node> = T & {
  parent?: ESTree.Node | null;
};

/**
 * Attempts to retrieve the closest parent of the specified type
 *
 * @param {ESTree.Node} node Node to begin from
 * @param {string[]} types Types to detect
 * @return {boolean}
 */
export function getParentNode<T extends ESTree.Node>(
  node: ESTree.Node,
  types: string[]
): T | undefined {
  let current: ESTree.Node | undefined = node;

  while (current !== undefined && !types.includes(current.type)) {
    const child = current as ChildNode<ESTree.Node>;

    if (child.parent !== undefined && child.parent !== null) {
      current = child.parent;
    } else {
      current = undefined;
    }
  }

  return current as T | undefined;
}

/**
 * Retrieves the identifier name if the passed node is a
 * `customElements.define` call.
 *
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function getDefineCallName(node: ESTree.Node): string | undefined {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    ((node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'customElements' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'define') ||
      (node.callee.object.type === 'MemberExpression' &&
        node.callee.object.object.type === 'Identifier' &&
        node.callee.object.object.name === 'customElements' &&
        node.callee.object.property.type === 'Identifier' &&
        node.callee.object.property.name === 'define')) &&
    node.arguments.length === 2
  ) {
    const secondArg = node.arguments[1];
    if (secondArg.type === 'Identifier') {
      return secondArg.name;
    }
  }
  return undefined;
}

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
): boolean {
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
