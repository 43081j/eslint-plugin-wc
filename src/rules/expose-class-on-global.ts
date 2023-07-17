/**
 * @fileoverview Enforces that custom element classes are exposed on the
 * global object (i.e. `window`)
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {resolveReference} from '../util/ast';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Enforces that custom element classes are exposed on the ' +
        'global object (i.e. window)',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/expose-class-on-global.md'
    },
    messages: {
      expose:
        'Custom element classes should be exposed on the global ' +
        'object (i.e. window)',
      sameName:
        'The exposed global name should match that of the ' +
        'custom element class'
    }
  },

  create(context): Rule.RuleListener {
    const seenClasses = new Set<ESTree.Node>();
    const source = context.getSourceCode();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const globalNames = new Set<string>(['window', 'globalThis']);

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
      'AssignmentExpression:exit': (
        node: ESTree.AssignmentExpression
      ): void => {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'Identifier' &&
          globalNames.has(node.left.object.name) &&
          node.left.property.type === 'Identifier' &&
          node.right.type === 'Identifier'
        ) {
          const classDef = resolveReference(node.right, context);

          if (
            classDef &&
            (classDef.type === 'ClassExpression' ||
              classDef.type === 'ClassDeclaration') &&
            classDef.id
          ) {
            seenClasses.delete(classDef);

            if (classDef.id.name !== node.left.property.name) {
              context.report({
                node,
                messageId: 'sameName'
              });
            }
          }
        }
      },
      'Program:exit': (): void => {
        for (const node of seenClasses) {
          context.report({
            node,
            messageId: 'expose'
          });
        }

        seenClasses.clear();
      }
    };
  }
};

export default rule;
