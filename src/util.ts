import * as ESTree from 'estree';

/**
 * Determines if a node is an element class or not.
 *
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function isCustomElement(node: ESTree.Node): node is ESTree.Class {
  console.log(node, node.leadingComments); // eslint-disable-line
  return (
    (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') &&
    ((node.superClass &&
      node.superClass.type === 'Identifier' &&
      node.superClass.name === 'HTMLElement') ||
      (node.leadingComments !== undefined &&
        node.leadingComments.length >= 1 &&
        node.leadingComments[0].value.startsWith('/**') &&
        node.leadingComments.some((c) => c.value.includes('@customElement'))))
  );
}
