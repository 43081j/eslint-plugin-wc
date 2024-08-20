/**
 * @fileoverview Requires that listeners be cleaned up on DOM disconnect
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Requires that listeners be cleaned up on DOM disconnect.',
      category: 'Best Practices',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/require-listener-teardown.md'
    },
    messages: {
      noTeardown:
        'Event listeners attached in `connectedCallback` should be' +
        'torn down during `disconnectedCallback`',
      noArrowBind:
        'Using an inline arrow function or `bind(...)` will result in ' +
        'creating a new function each time you call add/removeEventListener. ' +
        'This will result in the original handler not being removed as ' +
        'expected. You should instead store a reference to the function ' +
        'and pass that in as your handler.'
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          hosts: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    ]
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const addListenerQuery =
      'MethodDefinition[key.name="connectedCallback"] ' +
      'CallExpression[callee.property.name="addEventListener"]';
    const removeListenerQuery =
      'MethodDefinition[key.name="disconnectedCallback"] ' +
      'CallExpression[callee.property.name="removeEventListener"]';
    const seen = new Map<string, ESTree.CallExpression>();
    const options = context.options[0];
    const trackedHosts = options?.hosts ?? ['this', 'window', 'document'];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const shouldTrackListener = (node: ESTree.MemberExpression): boolean => {
      const source = context.getSourceCode();

      const text = source.getText(node.object);

      return trackedHosts.includes(text);
    };
    const isInlineFunction = (node: ESTree.Node): boolean =>
      node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression' ||
      (node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'bind');

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const onAddListener = (node: ESTree.CallExpression): void => {
      if (
        node.callee.type === 'MemberExpression' &&
        shouldTrackListener(node.callee)
      ) {
        const source = context.getSourceCode();
        const calleeText = source.getText(node.callee.object);
        const [arg0, arg1] = node.arguments;

        if (isInlineFunction(arg1)) {
          context.report({
            node: arg1,
            messageId: 'noArrowBind'
          });
        }

        if (arg0.type === 'Literal' && typeof arg0.value === 'string') {
          seen.set(`${calleeText}:${arg0.value}`, node);
        }
      }
    };

    const onRemoveListener = (node: ESTree.CallExpression): void => {
      if (
        node.callee.type === 'MemberExpression' &&
        shouldTrackListener(node.callee)
      ) {
        const source = context.getSourceCode();
        const calleeText = source.getText(node.callee.object);
        const [arg0, arg1] = node.arguments;

        if (isInlineFunction(arg1)) {
          context.report({
            node: arg1,
            messageId: 'noArrowBind'
          });
        }

        if (arg0.type === 'Literal' && typeof arg0.value === 'string') {
          seen.delete(`${calleeText}:${arg0.value}`);
        }
      }
    };
    const classExit = (): void => {
      for (const expr of seen.values()) {
        context.report({
          node: expr,
          messageId: 'noTeardown'
        });
      }
      seen.clear();
    };

    return {
      [addListenerQuery]: (node: ESTree.Node): void =>
        onAddListener(node as ESTree.CallExpression),
      [removeListenerQuery]: (node: ESTree.Node): void =>
        onRemoveListener(node as ESTree.CallExpression),
      'ClassExpression:exit': classExit,
      'ClassDeclaration:exit': classExit
    };
  }
};

export default rule;
