/**
 * @fileoverview Disallows attaching a shadow root outside the constructor
 * @author Michael Stramel <https://github.com/stramel>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {getDefineCallName, getParentNode, isCustomElement} from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows attaching a shadow root outside the constructor',
      url:
        'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/attach-shadow-constructor.md'
    },
    messages: {
      attachShadowConstructor:
        'Attaching a Shadow Root should only occur in the constructor of an element.'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const source = context.getSourceCode();
    const scannedMembers = new Set<ESTree.Node>();
    const scannedDefinitions = new Set<string>();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.Node): void => {
        if (node.type === 'CallExpression') {
          const parent = getParentNode<ESTree.MethodDefinition>(node, [
            'MethodDefinition'
          ]);

          const isConstructor =
            parent !== undefined &&
            parent.kind === 'constructor' &&
            parent.static === false &&
            parent.key.type === 'Identifier' &&
            parent.key.name === 'constructor';

          if (
            !isConstructor &&
            node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'ThisExpression' &&
            node.callee.property.type === 'Identifier' &&
            node.callee.property.name === 'attachShadow'
          ) {
            scannedMembers.add(node);
          }

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
              messageId: 'attachShadowConstructor'
            });
          }
        }
      }
    };
  }
};

export default rule;
