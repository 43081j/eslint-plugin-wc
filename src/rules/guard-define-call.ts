/**
 * @fileoverview Require `define(...)` calls to include an `if` statement
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isDefineCall, isGetCall} from '../util/customElements';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Require `define(...)` calls to include an `if` statement',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/guard-define-call.md'
    },
    messages: {
      guard:
        '`customElements.define` call should be wrapped in an `if` which ' +
        ' asserts that the element has not already been defined.'
    }
  },

  create(context): Rule.RuleListener {
    const definedCustomElements = new Set<string>();
    const source = context.sourceCode;
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (
        node: ESTree.CallExpression & Rule.NodeParentExtension
      ): void => {
        const arg0 = node.arguments[0];
        const tagName =
          arg0 && arg0.type === 'Literal' && typeof arg0.value === 'string'
            ? arg0.value
            : null;

        if (isDefineCall(node) && tagName) {
          const inTryCatch =
            node.parent.type === 'ExpressionStatement' &&
            node.parent.parent.type === 'BlockStatement' &&
            node.parent.parent.parent.type === 'TryStatement';

          if (definedCustomElements.has(tagName)) {
            definedCustomElements.delete(tagName);
          } else if (!inTryCatch) {
            context.report({
              node,
              messageId: 'guard'
            });
          }
        }

        if (isGetCall(node) && tagName) {
          const ancestors = source.getAncestors(node);
            : context.getAncestors();
          const isInsideIfStatement = ancestors.some(
            (ancestor): boolean =>
              ancestor.type === 'IfStatement' &&
              ancestors.includes(ancestor.test) &&
              (ancestor.test.type === 'UnaryExpression' ||
                ancestor.test.type === 'BinaryExpression' ||
                ancestor.test.type === 'LogicalExpression')
          );
          if (isInsideIfStatement) {
            if (
              node.parent.type === 'UnaryExpression' &&
              node.parent.operator === '!'
            ) {
              let unaryCounter = 0;
              let unaryNode: ESTree.Node & Rule.NodeParentExtension =
                node.parent;

              while (unaryNode.type === 'UnaryExpression') {
                unaryCounter++;
                unaryNode = unaryNode.parent;
              }

              if (unaryCounter % 2 !== 0) {
                definedCustomElements.add(tagName);
              }
            } else if (node.parent.type !== 'LogicalExpression') {
              definedCustomElements.add(tagName);
            }
          }
        }
      }
    };
  }
};

export default rule;
