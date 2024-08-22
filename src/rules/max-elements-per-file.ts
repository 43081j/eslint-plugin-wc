/**
 * @fileoverview Enforces a maximum number of elements per file
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Enforces a maximum number of elements per file',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/max-elements-per-file.md'
    },
    messages: {
      tooMany: 'Only {{count}} element(s) should be defined per individual file'
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 1
          }
        }
      }
    ]
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const source = context.sourceCode;
    const maxElements = context.options[0]?.max ?? 1;
    let elementCount = 0;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (
          isCustomElement(context, node, source.getJSDocComment(node)) &&
          ++elementCount > maxElements
        ) {
          context.report({
            node,
            messageId: 'tooMany',
            data: {count: maxElements}
          });
        }
      }
    };
  }
};

export default rule;
