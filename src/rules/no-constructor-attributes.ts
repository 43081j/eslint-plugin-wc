/**
 * @fileoverview Disallows interaction with attributes in constructors
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
      description: 'Disallows interaction with attributes in constructors',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-constructor-attributes.md'
    },
    messages: {
      constructorAttrs:
        'Attributes must not be interacted with in the ' +
        'constructor as the element may not be ready yet.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideConstructor = false;
    let insideElement = false;
    const bannedCallExpressions = [
      'append',
      'appendChild',
      'getAttribute',
      'getElementsByClassName',
      'getElementsByTagName',
      'hasAttribute',
      'hasAttributes',
      'insertBefore',
      'querySelector',
      'querySelectorAll',
      'removeAttribute',
      'removeChild',
      'replaceChild',
      'setAttribute',
      'toggleAttribute'
    ];
    const bannedMembers = [
      // Child node inspection
      'innerHTML',
      'children',
      'childNodes',
      'firstChild',
      'lastChild',
      'attributes',
      // Global reflected attributes
      'accessKey',
      'autocapitalize',
      'className',
      'classList',
      'contentEditable',
      'dataset',
      'dir',
      'draggable',
      'hidden',
      'id',
      'lang',
      'slot',
      'spellcheck',
      'style',
      'tabIndex',
      'title',
      'translate'
    ];
    const source = context.getSourceCode();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Determines if a call expression is banned or not.
     * This is true if it is in the banned list and has been called
     * on `this`, or if it is a `document.write`
     * or `document.open`.
     *
     * @param {ESTree.CallExpression} node Node to test
     * @return {boolean}
     */
    function isBannedCallExpr(node: ESTree.CallExpression): boolean {
      return (
        node.callee.type === 'MemberExpression' &&
        ((node.callee.object.type === 'ThisExpression' &&
          node.callee.property.type === 'Identifier' &&
          bannedCallExpressions.includes(node.callee.property.name)) ||
          (node.callee.object.type === 'Identifier' &&
            node.callee.object.name === 'document' &&
            node.callee.property.type === 'Identifier' &&
            (node.callee.property.name === 'write' ||
              node.callee.property.name === 'open')))
      );
    }

    /**
     * Determines if a member expression is banned or not.
     * This is true if it is in the banned list of members, such
     * as `innerHTML`.
     * It includes setting and getting of said members.
     *
     * @param {ESTree.MemberExpression} node Node to test
     * @return {boolean}
     */
    function isBannedMember(node: ESTree.MemberExpression): boolean {
      return (
        node.object.type === 'ThisExpression' &&
        node.property.type === 'Identifier' &&
        bannedMembers.includes(node.property.name)
      );
    }

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
          node.static === false &&
          node.key.type === 'Identifier' &&
          node.key.name === 'constructor'
        ) {
          insideConstructor = true;
        }
      },
      'MethodDefinition:exit': (): void => {
        insideConstructor = false;
      },
      CallExpression: (node: ESTree.CallExpression): void => {
        if (insideConstructor && isBannedCallExpr(node)) {
          context.report({node: node, messageId: 'constructorAttrs'});
        }
      },
      MemberExpression: (node: ESTree.MemberExpression): void => {
        if (insideConstructor && isBannedMember(node)) {
          context.report({node: node, messageId: 'constructorAttrs'});
        }
      }
    };
  }
};

export default rule;
