/**
 * @fileoverview Disallows interaction with attributes in constructors
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement, getDefineCallName, getParentNode} from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows interaction with attributes in constructors',
      url:
        'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-constructor-attributes.md'
    },
    messages: {
      constructorAttrs:
        'Attributes must not be interacted with in the ' +
        'constructor as the element may not be ready yet.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
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
    const scannedMembers = new Set<ESTree.Node>();
    const scannedDefinitions = new Set<string>();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Determines if a call expression is banned or not.
     * This is true if it is in the banned list and has been called
     * on `this` or `this.shadowRoot`, or if it is a `document.write`
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
          ((node.callee.object.type === 'MemberExpression' &&
            node.callee.object.object.type === 'ThisExpression' &&
            node.callee.object.property.type === 'Identifier' &&
            node.callee.object.property.name === 'shadowRoot' &&
            node.callee.property.type === 'Identifier' &&
            bannedCallExpressions.includes(node.callee.property.name)) ||
            (node.callee.object.type === 'Identifier' &&
              node.callee.object.name === 'document' &&
              node.callee.property.type === 'Identifier' &&
              (node.callee.property.name === 'write' ||
                node.callee.property.name === 'open'))))
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
        (node.object.type === 'ThisExpression' &&
          node.property.type === 'Identifier' &&
          bannedMembers.includes(node.property.name)) ||
        (node.object.type === 'MemberExpression' &&
          node.object.object.type === 'ThisExpression' &&
          node.object.property.type === 'Identifier' &&
          node.object.property.name === 'shadowRoot' &&
          node.property.type === 'Identifier' &&
          bannedMembers.includes(node.property.name))
      );
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.Node): void => {
        if (node.type === 'CallExpression') {
          const parent = getParentNode<ESTree.MethodDefinition>(node, [
            'MethodDefinition'
          ]);

          if (
            parent !== undefined &&
            parent.kind === 'constructor' &&
            parent.static === false &&
            parent.key.type === 'Identifier' &&
            parent.key.name === 'constructor' &&
            isBannedCallExpr(node)
          ) {
            scannedMembers.add(node);
          }

          const definedName = getDefineCallName(node);

          if (definedName !== undefined) {
            scannedDefinitions.add(definedName);
          }
        }
      },
      MemberExpression: (node: ESTree.Node): void => {
        const parent = getParentNode<ESTree.MethodDefinition>(node, [
          'MethodDefinition'
        ]);

        if (
          node.type === 'MemberExpression' &&
          parent !== undefined &&
          parent.kind === 'constructor' &&
          parent.static === false &&
          parent.key.type === 'Identifier' &&
          parent.key.name === 'constructor' &&
          isBannedMember(node)
        ) {
          scannedMembers.add(node);
        }
      },
      'Program:exit': (): void => {
        for (const member of scannedMembers) {
          const parent = getParentNode<ESTree.Class>(member, [
            'ClassDeclaration',
            'ClassExpression'
          ]);

          if (
            parent !== undefined &&
            (isCustomElement(parent, source.getJSDocComment(parent)) ||
              (parent.id !== undefined &&
                parent.id !== null &&
                parent.id.type === 'Identifier' &&
                scannedDefinitions.has(parent.id.name)))
          ) {
            context.report({node: member, messageId: 'constructorAttrs'});
          }
        }
      }
    };
  }
};

export default rule;
