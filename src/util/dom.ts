import * as ESTree from 'estree';

export const childPropertyList = new Set<string>([
  // ParentNode
  'childElementCount',
  'children',
  'firstElementChild',
  'lastElementChild',

  // Node
  'childNodes',
  'firstChild',
  'innerHTML',
  'innerText',
  'lastChild',
  'textContent'
]);

export const childMethodList = new Set<string>([
  // Document
  'getElementById',
  'getElementsByClassName',
  'getElementsByTagName',

  // ParentNode
  'querySelector',
  'querySelectorAll',

  // Node
  'contains',
  'hasChildNodes',
  'insertBefore',
  'removeChild',
  'replaceChild'
]);

/**
 * Determines if a node is `this.*` or `this.shadowRoot.*`
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function isThisOrShadowRoot(node: ESTree.Node): boolean {
  return (
    node.type === 'ThisExpression' ||
    (node.type === 'MemberExpression' &&
      node.object.type === 'ThisExpression' &&
      node.property.type === 'Identifier' &&
      node.property.name === 'shadowRoot')
  );
}
