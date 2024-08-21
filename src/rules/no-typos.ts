/**
 * @fileoverview Prevents common typos
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import levenshtein from 'js-levenshtein-esm';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Detects misspellings of common features',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-typos.md'
    },
    messages: {
      method:
        'Method name is likely a misspelling, did you mean "{{replacement}}"?',
      member:
        'Member name is likely a misspelling, did you mean "{{replacement}}"?'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideElement = false;
    const source = context.sourceCode;
    const lifecycleMethods = [
      'connectedCallback',
      'disconnectedCallback',
      'adoptedCallback',
      'attributeChangedCallback'
    ];

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
          if (
            node.kind === 'method' &&
            !node.static &&
            node.key.type === 'Identifier'
          ) {
            const name = node.key.name;
            const match = lifecycleMethods
              .map<[string, number]>((m) => {
                const result = levenshtein(m, name);
                return [m, result];
              })
              .filter((pair) => pair[1] !== 0 && pair[1] < 3)
              .sort((a, b) => a[1] - b[1]);

            if (match.length > 0) {
              context.report({
                node: node.key,
                messageId: 'method',
                data: {
                  replacement: match[0][0]
                }
              });
            }
          } else if (
            node.kind === 'get' &&
            node.static &&
            node.key.type === 'Identifier'
          ) {
            const result = levenshtein(node.key.name, 'observedAttributes');
            if (result !== 0 && result < 3) {
              context.report({
                node: node.key,
                messageId: 'member',
                data: {
                  replacement: 'observedAttributes'
                }
              });
            }
          }
        }
      }
    };
  }
};

export default rule;
