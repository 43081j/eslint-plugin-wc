/**
 * @fileoverview Disallows extending of built-in elements
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util.js';
import {builtInTagClassList} from '../util/tag-names.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows extending of built-in elements',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-customized-built-in-elements.md'
    },
    messages: {
      noBuiltIn:
        'You should avoid extending built-in elements as support ' +
        'is not guaranteed.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const source = context.sourceCode;

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
          node.superClass &&
          node.superClass.type === 'Identifier' &&
          node.superClass.name !== 'HTMLElement' &&
          builtInTagClassList.includes(node.superClass.name)
        ) {
          context.report({
            node,
            messageId: 'noBuiltIn'
          });
        }
      }
    };
  }
};

export default rule;
