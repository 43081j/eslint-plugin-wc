import * as ESTree from 'estree';

/**
 * Computes the name of a given method node
 * @param {ESTree.MethodDefinition} node Node to retrieve name from
 * @return {string|null}
 */
export function getMethodName(node: ESTree.MethodDefinition): string | null {
  if (
    node.key.type === 'PrivateIdentifier' ||
    (node.key.type === 'Identifier' && !node.computed)
  ) {
    return node.key.name;
  }

  if (node.key.type === 'Literal') {
    return String(node.key.value);
  }

  return null;
}
