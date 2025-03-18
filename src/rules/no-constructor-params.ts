/**
 * @fileoverview Disallows constructor parameters in custom elements
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows constructor parameters in custom elements',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-constructor-params.md'
    },
    messages: {
      noParams:
        'Constructors must not have parameters as they are called with ' +
        'no parameters when custom elements are created by the browser.'
    }
  },

  create(context): Rule.RuleListener {
    const constructorQuery =
      'ClassBody > MethodDefinition[kind="constructor"]' +
      '[value.params.length > 0]';
    let insideElement = false;
    const source = context.sourceCode;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const visitConstructor = (node: ESTree.MethodDefinition): void => {
      if (insideElement) {
        context.report({
          node,
          messageId: 'noParams'
        });
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      [`ClassExpression > ${constructorQuery}`]: visitConstructor,
      [`ClassDeclaration > ${constructorQuery}`]: visitConstructor,
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (isCustomElement(context, node, source.getJSDocComment(node))) {
          insideElement = true;
        }
      },
      'ClassDeclaration,ClassExpression:exit': (): void => {
        insideElement = false;
      }
    };
  }
};

export default rule;
