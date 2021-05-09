/**
 * @fileoverview Disallows constructor parameters in custom elements
 * @author James Garbutt <https://github.com/43081j>
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
      description: 'Disallows constructor parameters in custom elements',
      url:
        'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-constructor-params.md'
    },
    messages: {
      noParams:
        'Constructors must be parameterless as they are created indirectly ' +
        'when appended to DOM.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const constructorQuery =
      'ClassBody > MethodDefinition[kind="constructor"]' +
      '[value.params.length > 0]';
    let insideElement = false;
    const source = context.getSourceCode();

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
      'ClassDeclaration,ClassExpression': (node: ESTree.Node): void => {
        if (
          (node.type === 'ClassExpression' ||
            node.type === 'ClassDeclaration') &&
          isCustomElement(context, node, source.getJSDocComment(node))
        ) {
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
