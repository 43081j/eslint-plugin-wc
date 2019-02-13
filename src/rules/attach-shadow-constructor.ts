/**
 * @fileoverview Disallows attaching shadow root outside of the constructor
 * @author Michael Stramel <https://github.com/stramel>
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
      description: 'Disallows attaching shadow root outside of the constructor',
      category: 'Best Practices',
      url:
        'https://developers.google.com/web/fundamentals/web-components/best-practices#create-your-shadow-root-in-the-constructor'
    },
    messages: {
      attachShadowConstructor:
        'Attaching a Shadow Root should only occur in the constructor of an element.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideNonConstructor = false;
    let insideElement = false;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Node): void => {
        if (
          (node.type === 'ClassExpression' ||
            node.type === 'ClassDeclaration') &&
          isCustomElement(node)
        ) {
          insideElement = true;
        }
      },
      'ClassDeclaration,ClassExpression:exit': (): void => {
        insideElement = false;
      },
      MethodDefinition: (node: ESTree.Node): void => {
        if (
          insideElement &&
          node.type === 'MethodDefinition' &&
          node.kind !== 'constructor' &&
          node.key.type === 'Identifier' &&
          node.key.name !== 'constructor'
        ) {
          insideNonConstructor = true;
        }
      },
      'MethodDefinition:exit': (): void => {
        insideNonConstructor = false;
      },
      CallExpression: (node: ESTree.Node): void => {
        if (
          insideNonConstructor &&
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'ThisExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'attachShadow'
        ) {
          context.report({node, messageId: 'attachShadowConstructor'});
        }
      }
    };
  }
};

export default rule;
