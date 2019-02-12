/**
 * @fileoverview Disallows invalid custom element names
 * @author Michael Stramel <https://github.com/stramel>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
const validate = require('validate-element-name');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows invalid custom element names',
      category: 'Recommended',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-invalid-element-names.md'
    },
    schema: [
      {
        type: 'object',
        properties: {
          loose: {type: 'boolean'}
        },
        additionalProperties: false
      }
    ]
  },

  create(context): Rule.RuleListener {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.Node): void => {
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          (node.callee.object.type === 'Identifier' && node.callee.object.name === 'customElements') &&
          (node.callee.property.type === 'Identifier' && node.callee.property.name === 'define') &&
          node.arguments[0] && node.arguments[0].type === 'Literal'
        ) {
          // @ts-ignore
          const validationResult = validate(node.arguments[0].value);

          const isWarning = !(context.options[0] && context.options[0].loose) && validationResult.message !== undefined;

          if (!validationResult.isValid || isWarning) {
            context.report({
              message: validationResult.message,
              node: node.arguments[0]
            });
          }
        }
      }
    };
  }
};

export = rule;
