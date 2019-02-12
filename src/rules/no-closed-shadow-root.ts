/**
 * @fileoverview Disallows closed shadow roots
 * @author James Garbutt <htttps://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows closed shadow roots',
      category: 'Best Practices',
      url:
        'https://github.com/43081j/eslint-plugin-lit/blob/master/docs/rules/no-closed-shadow-root.md'
    },
    messages: {
      closedRoot:
        'Closed shadow roots are rarely needed and generally ' +
        'not recommended'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Retrieves the `mode` property from an object, if any.
     *
     * @param {ESTree.ObjectExpression} node Node to check
     * @return {boolean}
     */
    function getClosedModeArgument(
      node: ESTree.CallExpression
    ): ESTree.Property | undefined {
      if (node.arguments.length !== 1) {
        return undefined;
      }
      const firstArg = node.arguments[0];
      if (firstArg.type !== 'ObjectExpression') {
        return undefined;
      }
      return firstArg.properties.find<ESTree.Property>(
        (n): n is ESTree.Property =>
          ((n.key.type === 'Identifier' && n.key.name === 'mode') ||
            (n.key.type === 'Literal' && n.key.value === 'mode')) &&
          n.value.type === 'Literal' &&
          n.value.value === 'closed'
      );
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.Node): void => {
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'attachShadow'
        ) {
          const arg = getClosedModeArgument(node);
          if (arg) {
            context.report({node: arg, messageId: 'closedRoot'});
          }
        }
      }
    };
  }
};

export default rule;
