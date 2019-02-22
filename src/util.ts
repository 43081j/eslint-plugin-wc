import * as ESTree from 'estree';
import {AST} from 'eslint';

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
  return (
    (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') &&
    ((node.superClass &&
      node.superClass.type === 'Identifier' &&
      node.superClass.name === 'HTMLElement') ||
      (jsdoc !== undefined &&
        jsdoc !== null &&
        jsdoc.value.includes('@customElement')))
  );
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
