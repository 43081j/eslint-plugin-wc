/**
 * @fileoverview Disallows exports alongside custom element exports
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {resolveReference} from '../util/ast';

const classSelector =
  'ExportNamedDeclaration :matches(' +
  'ClassDeclaration, ClassExpression, FunctionDeclaration)';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows exports alongside custom element exports',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-exports-with-element.md'
    },
    messages: {
      noExports:
        'No additional exports should be defined when exporting a ' +
        'custom element'
    }
  },

  create(context): Rule.RuleListener {
    const seenClasses = new Set<ESTree.Node>();
    const exportedNodes = new Set<ESTree.Node>();
    let hasElement = false;
    const source = context.sourceCode;

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (isCustomElement(context, node, source.getJSDocComment(node))) {
          hasElement = true;
          seenClasses.add(node);
        }

        // Allow classes which inherit `Event` since they're likely
        // useful alongside the element
        if (
          node.superClass &&
          node.superClass.type === 'Identifier' &&
          node.superClass.name === 'Event'
        ) {
          seenClasses.add(node);
        }
      },
      'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator': (
        node: ESTree.VariableDeclarator
      ): void => {
        if (node.init) {
          exportedNodes.add(node.init);
        }
      },
      'ExportNamedDeclaration ExportSpecifier': (
        node: ESTree.ExportSpecifier
      ): void => {
        exportedNodes.add(node.local);
      },
      [classSelector]: (node: ESTree.Node): void => {
        exportedNodes.add(node);
      },
      ExportDefaultDeclaration: (
        node: ESTree.ExportDefaultDeclaration
      ): void => {
        let declaration = node.declaration;

        if (declaration.type === 'AssignmentExpression') {
          declaration = declaration.right;
        }

        exportedNodes.add(declaration);
      },
      'Program:exit': (): void => {
        if (!hasElement) {
          return;
        }

        for (const ref of exportedNodes) {
          const node = resolveReference(ref, context);

          if (seenClasses.has(node)) {
            continue;
          }

          context.report({
            node,
            messageId: 'noExports'
          });
        }
      }
    };
  }
};

export default rule;
