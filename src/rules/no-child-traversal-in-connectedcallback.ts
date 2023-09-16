/**
 * @fileoverview Disallows traversal of children in the
 * `connectedCallback` method
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule, Scope} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {
  childPropertyList,
  childMethodList,
  isThisOrShadowRoot
} from '../util/dom';

const allowedScopes = new Set<string>(['addEventListener', 'MutationObserver']);

/**
 * Determines if a scope should allow child traversal
 * @param {Rule.Scope.Scope} scope Scope to test
 * @return {boolean}
 */
function isAllowedScope(scope: Scope.Scope): boolean {
  if (scope.type !== 'function') {
    return false;
  }

  const blockNode = scope.block as ESTree.Node & Rule.NodeParentExtension;

  if (!blockNode.parent) {
    return false;
  }

  const parentNode = blockNode.parent;

  if (
    parentNode.type !== 'CallExpression' &&
    parentNode.type !== 'NewExpression'
  ) {
    return false;
  }

  if (
    parentNode.callee.type === 'MemberExpression' &&
    parentNode.callee.property.type === 'Identifier' &&
    allowedScopes.has(parentNode.callee.property.name)
  ) {
    return true;
  }

  if (
    parentNode.callee.type === 'Identifier' &&
    allowedScopes.has(parentNode.callee.name)
  ) {
    return true;
  }

  return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Disallows traversal of children in the ' +
        '`connectedCallback` method',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-child-traversal-in-connectedcallback.md'
    },
    messages: {
      domMethod:
        'Traversing children in the `connectedCallback` ' +
        'method is error prone and should be avoided',
      domProp:
        'Accessing local DOM properties in the ' +
        '`connectedCallback` method is error prone and should be avoided'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideCallback = false;
    let insideElement = false;
    const source = context.getSourceCode();

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
          !node.static &&
          node.key.type === 'Identifier' &&
          node.key.name === 'connectedCallback'
        ) {
          insideCallback = true;
        }
      },
      'MethodDefinition:exit': (): void => {
        insideCallback = false;
      },
      MemberExpression: (
        node: ESTree.MemberExpression & Rule.NodeParentExtension
      ): void => {
        if (!insideCallback) {
          return;
        }

        if (node.property.type !== 'Identifier') {
          // Don't bother with expressions that have funky properties
          return;
        }

        const parentNode = node.parent;

        if (parentNode.type === 'AssignmentExpression') {
          // Allow things like textContent/innerHTML assignments
          return;
        }

        const scope = context.getScope();
        const name = node.property.name;

        if (isAllowedScope(scope)) {
          // some scopes, like event handlers, are fine
          return;
        }

        if (!isThisOrShadowRoot(node.object)) {
          // Only look for `this.*` or `this.shadowRoot.*`
          return;
        }

        if (childPropertyList.has(name)) {
          context.report({
            node,
            messageId: 'domProp'
          });
        }

        if (
          parentNode.type === 'CallExpression' &&
          parentNode.callee === node &&
          childMethodList.has(name)
        ) {
          context.report({
            node,
            messageId: 'domMethod'
          });
        }
      }
    };
  }
};

export default rule;
