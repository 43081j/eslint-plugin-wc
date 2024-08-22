/**
 * @fileoverview Disallows traversal of children in the
 * `AttributeChangedCallback` method
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {
  childPropertyList,
  childMethodList,
  isThisOrShadowRoot
} from '../util/dom';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Disallows traversal of children in the ' +
        '`AttributeChangedCallback` method',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-child-traversal-in-attributechangedcallback.md'
    },
    messages: {
      domMethod:
        'Traversing children in the `attributeChangedCallback` ' +
        'method is error prone and should be avoided',
      domProp:
        'Accessing local DOM properties in the ' +
        '`attributeChangedCallback` method is error prone and should be avoided'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    let insideCallback = false;
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
          !node.static &&
          node.key.type === 'Identifier' &&
          node.key.name === 'attributeChangedCallback'
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

        const name = node.property.name;

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
