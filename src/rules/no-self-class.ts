/**
 * @fileoverview Disallows class mutations on self
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
      description: 'Disallows class mutations on self',
      category: 'Best Practices',
      url:
        'https://github.com/43081j/eslint-plugin-lit/blob/master/docs/rules/no-self-class.md'
    },
    messages: {
      selfClass:
        'Classes should be considered owned by the consumer of the element, ' +
        'meaning they should never be mutated on `this`.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideElement = false;
    const bannedClassListMethods = ['add', 'remove', 'toggle', 'replace'];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Determines if a call expression is of a banned type, such as
     * classList additions.
     *
     * @param {ESTree.CallExpression} node Node to test
     * @return {boolean}
     */
    function isBannedCallExpr(node: ESTree.CallExpression): boolean {
      return (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'MemberExpression' &&
        node.callee.object.object.type === 'ThisExpression' &&
        node.callee.object.property.type === 'Identifier' &&
        node.callee.object.property.name === 'classList' &&
        node.callee.property.type === 'Identifier' &&
        bannedClassListMethods.includes(node.callee.property.name)
      );
    }

    /**
     * Determines if an assignment expression is of a banned type, such
     * as className assignments.
     *
     * @param {ESTree.AssignmentExpression} node Node to test
     * @return {boolean}
     */
    function isBannedAssignmentExpr(
      node: ESTree.AssignmentExpression
    ): boolean {
      return (
        node.left.type === 'MemberExpression' &&
        node.left.object.type === 'ThisExpression' &&
        node.left.property.type === 'Identifier' &&
        node.left.property.name === 'className'
      );
    }

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
      AssignmentExpression: (node: ESTree.Node): void => {
        if (
          insideElement &&
          node.type === 'AssignmentExpression' &&
          isBannedAssignmentExpr(node)
        ) {
          context.report({node: node, messageId: 'selfClass'});
        }
      },
      CallExpression: (node: ESTree.Node): void => {
        if (
          insideElement &&
          node.type === 'CallExpression' &&
          isBannedCallExpr(node)
        ) {
          context.report({node: node, messageId: 'selfClass'});
        }
      }
    };
  }
};

export default rule;
