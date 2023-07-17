import * as ESTree from 'estree';
import {Rule} from 'eslint';

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

/**
 * Attempts to resolve any references, e.g. if a node is an identifier
 * @param {ESTree.Node} node Node to resolve
 * @param {Rule.RuleContext} context Rule context
 * @return {ESTree.Node}
 */
export function resolveReference(
  node: ESTree.Node,
  context: Rule.RuleContext
): ESTree.Node {
  if (node.type !== 'Identifier') {
    return node;
  }

  const ref = context
    .getSourceCode()
    .getScope(node)
    .references.find((r) => r.identifier.name === node.name);

  if (ref?.resolved && ref.resolved.defs.length === 1) {
    return ref.resolved.defs[0].node;
  }

  return node;
}
