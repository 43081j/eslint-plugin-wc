/**
 * @fileoverview Enforces that the `define(...)` call happens after the
 * associated class has been defined
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement, isDefineCall} from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Enforces that the `define(...)` call happens after' +
        ' the associated class has been defined',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/define-tag-after-class-definition.md'
    },
    messages: {
      unregistered:
        'Custom element class has not been registered with ' +
        ' a `customElements.define` call',
      noExpressions:
        'Custom element classes should not be declared inline. ' +
        'They should be exported as concrete class declarations.'
    }
  },

  create(context): Rule.RuleListener {
    const seenClasses = new Set<ESTree.Node>();
    const source = context.getSourceCode();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (
          isCustomElement(context, node, source.getJSDocComment(node)) &&
          node.id?.type === 'Identifier'
        ) {
          seenClasses.add(node);
        }
      },
      CallExpression: (node: ESTree.CallExpression): void => {
        const tagClass = node.arguments[1];

        if (isDefineCall(node)) {
          if (tagClass.type === 'Identifier') {
            const ref = context
              .getScope()
              .references.find((r) => r.identifier.name === tagClass.name);

            if (ref?.resolved && ref.resolved.defs.length === 1) {
              seenClasses.delete(ref.resolved.defs[0].node);
            }
          } else if (tagClass.type === 'ClassExpression') {
            seenClasses.delete(tagClass);
            context.report({
              node: tagClass,
              messageId: 'noExpressions'
            });
          }
        }
      },
      'Program:exit': (): void => {
        for (const node of seenClasses) {
          context.report({
            node,
            messageId: 'unregistered'
          });
        }

        seenClasses.clear();
      }
    };
  }
};

export default rule;
