import * as ESTree from 'estree';

/**
 * Determines if a node is a `customElements` reference
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function isCustomElementsRegistry(node: ESTree.Node): boolean {
  return (
    (node.type === 'Identifier' && node.name === 'customElements') ||
    (node.type === 'MemberExpression' &&
      node.object.type === 'Identifier' &&
      (node.object.name === 'window' || node.object.name === 'globalThis') &&
      node.property.type === 'Identifier' &&
      node.property.name === 'customElements')
  );
}

/**
 * Determines if a call expression is a `customElements.define` call
 * @param {ESTree.CallExpression} node Node to test
 * @return {boolean}
 */
export function isDefineCall(node: ESTree.CallExpression): boolean {
  return (
    node.callee.type === 'MemberExpression' &&
    isCustomElementsRegistry(node.callee.object) &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'define'
  );
}

/**
 * Determines if a call expression is a `customElements.get` call
 * @param {ESTree.CallExpression} node Node to test
 * @return {boolean}
 */
export function isGetCall(node: ESTree.CallExpression): boolean {
  return (
    node.callee.type === 'MemberExpression' &&
    isCustomElementsRegistry(node.callee.object) &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'get'
  );
}
