/**
 * @fileoverview Disallows constructors in custom element classes
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
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
      description: 'Disallows constructors in custom element classes',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-constructor.md'
    },
    messages: {
      noConstructor:
        'Constructors should be avoided in custom elements. ' +
        'Consider using lifecycle methods instead (e.g. `connectedCallback`)'
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
        if (
          insideElement &&
          node.kind === 'constructor' &&
          node.key.type === 'Identifier' &&
          node.key.name === 'constructor'
        ) {
          context.report({
            node,
            messageId: 'noConstructor'
          });
        }
      }
    };
  }
};

export default rule;
