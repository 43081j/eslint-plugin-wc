/**
 * @fileoverview Disallows methods prefixed with `on`
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {getMethodName} from '../util/ast';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows methods prefixed with `on`',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-method-prefixed-with-on.md'
    },
    messages: {
      noPrefix:
        'Avoid using `on` as a prefix of method names as they can ' +
        'easily conflict with reserved event handler names'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideElement = false;
    const source = context.sourceCode;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (isCustomElement(context, node, source.getJSDocComment(node))) {
          insideElement = true;
        }
      },
      'ClassDeclaration,ClassExpression:exit': (): void => {
        insideElement = false;
      },
      MethodDefinition: (node: ESTree.MethodDefinition): void => {
        if (insideElement) {
          const name = getMethodName(node);

          if (name?.startsWith('on')) {
            context.report({
              node,
              messageId: 'noPrefix'
            });
          }
        }
      }
    };
  }
};

export default rule;
