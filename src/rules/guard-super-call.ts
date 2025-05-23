/**
 * @fileoverview Requires a guard before calling a super method inside a
 *  Custom Element Lifecycle hook
 * @author Michael Stramel <https://github.com/stramel>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement, isNativeCustomElement} from '../util.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Requires a guard before calling a super lifecycle hook',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/guard-super-call.md'
    },
    messages: {
      guardSuperCall:
        'Super calls to lifecycle callbacks should be guarded in case the base class does not implement them'
    }
  },

  create(context): Rule.RuleListener {
    let insideNonNativeElement = false;
    let errNode = null;
    const source = context.sourceCode;

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
    function isUnguardedSuperHook(node: ESTree.Node, hook: string): boolean {
      if (isSuperHookExpression(node, hook)) {
        errNode = node;
        return true;
      } else if (node.type === 'IfStatement' && !isSuperHook(node.test, hook)) {
        return isUnguardedSuperHook(node.consequent, hook);
      } else if (
        node.type === 'BlockStatement' &&
        node.body.some((n) => isUnguardedSuperHook(n, hook))
      ) {
        return true;
      }
      return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (
          isCustomElement(context, node, source.getJSDocComment(node)) &&
          !isNativeCustomElement(node)
        ) {
          insideNonNativeElement = true;
        }
      },
      'ClassDeclaration,ClassExpression:exit': (): void => {
        insideNonNativeElement = false;
      },
      MethodDefinition: (node: ESTree.MethodDefinition): void => {
        if (!insideNonNativeElement || !isLifecycleHook(node)) {
          return;
        }

        errNode = node;

        if (
          node.key.type === 'Identifier' &&
          node.value.type === 'FunctionExpression' &&
          isUnguardedSuperHook(node.value.body, node.key.name)
        ) {
          context.report({
            node: errNode,
            messageId: 'guardSuperCall'
          });
        }
      }
    };
  }
};

export default rule;
