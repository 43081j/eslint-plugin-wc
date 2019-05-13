/**
 * @fileoverview Requires a guard before calling a super method inside a
 *  Custom Element Lifecycle hook
 * @author Michael Stramel <https://github.com/stramel>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {
  isCustomElement,
  isNativeCustomElement,
  getParentNode,
  getDefineCallName
} from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows attaching shadow root outside of the constructor',
      url:
        'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/guard-super-call.md'
    },
    messages: {
      guardSuperCall:
        'Super calls to lifecycle callbacks should be guarded in case the base class does not implement them'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const scannedMembers = new Set<ESTree.Node>();
    const scannedDefinitions = new Set<string>();
    const source = context.getSourceCode();

    const nativeHooks = [
      'connectedCallback',
      'disconnectedCallback',
      'adoptedCallback',
      'attributeChangedCallback'
    ];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Determines if a method is a lifecycle hook
     * @param {ESTree.MethodDefinition} node Node to test
     * @return {boolean}
     */
    function isLifecycleHook(
      node: ESTree.Node
    ): node is ESTree.MethodDefinition {
      return (
        node.type === 'MethodDefinition' &&
        node.key.type === 'Identifier' &&
        nativeHooks.includes(node.key.name)
      );
    }

    /**
     * Determines if a member expression is the super's specified lifecycle hook
     * @param {ESTree.MemberExpression} node Node to test
     * @param {string} hook hook to test
     * @return {boolean}
     */
    function isSuperHook(
      node: ESTree.Node,
      hook: string
    ): node is ESTree.MemberExpression {
      return (
        node.type === 'MemberExpression' &&
        node.object.type === 'Super' &&
        node.property.type === 'Identifier' &&
        node.property.name === hook
      );
    }

    /**
     * Determines if an expression statement is a super lifecycle hook call
     * @param {ESTree.ExpressionStatement} node Node to test
     * @param {string} hook hook to test
     * @return {boolean}
     */
    function isSuperHookExpression(
      node: ESTree.Node,
      hook: string
    ): node is ESTree.ExpressionStatement {
      return (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'CallExpression' &&
        isSuperHook(node.expression.callee, hook)
      );
    }

    /**
     * Determines if a statement is an unguarded super hook
     * @param {ESTree.Statement} node Node to test
     * @param {string} hook hook to test
     * @return {boolean}
     */
    function findUnguardedSuperHook(
      node: ESTree.Node,
      hook: string
    ): ESTree.Node | undefined {
      if (isSuperHookExpression(node, hook)) {
        return node;
      }

      if (node.type === 'IfStatement' && !isSuperHook(node.test, hook)) {
        return findUnguardedSuperHook(node.consequent, hook);
      }

      if (node.type === 'BlockStatement') {
        for (const child of node.body) {
          const found = findUnguardedSuperHook(child, hook);
          if (found) {
            return found;
          }
        }
      }

      return undefined;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      MethodDefinition: (node: ESTree.Node): void => {
        const parent = getParentNode<ESTree.Class>(node, [
          'ClassDeclaration',
          'ClassExpression'
        ]);

        if (
          parent &&
          !isNativeCustomElement(parent) &&
          isLifecycleHook(node) &&
          node.key.type === 'Identifier' &&
          node.value.type === 'FunctionExpression'
        ) {
          const hook = findUnguardedSuperHook(node.value.body, node.key.name);
          if (hook !== undefined) {
            scannedMembers.add(hook);
          }
        }
      },
      CallExpression: (node: ESTree.Node): void => {
        if (node.type === 'CallExpression') {
          const definedName = getDefineCallName(node);

          if (definedName !== undefined) {
            scannedDefinitions.add(definedName);
          }
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
            context.report({
              node: member,
              messageId: 'guardSuperCall'
            });
          }
        }
      }
    };
  }
};

export default rule;
