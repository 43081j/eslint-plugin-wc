/**
 * @fileoverview Disallows unused entries in static scopedElements
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';

function filterLiteralKeys(
  properties: Array<ESTree.Property | ESTree.SpreadElement>
): string[] {
  return properties.flatMap((prop) => {
    if (prop.type !== 'Property' || prop.key.type !== 'Literal') {
      return [];
    }
    return typeof prop.key.value === 'string' ? [prop.key.value] : [];
  });
}

function extractTagsFromNode(
  valueNode: ESTree.Expression | ESTree.PrivateIdentifier | null | undefined
): string[] {
  if (!valueNode) {
    return [];
  }

  switch (valueNode.type) {
    case 'ObjectExpression':
      return filterLiteralKeys(valueNode.properties);
    case 'FunctionExpression': {
      const returnStatement = valueNode.body.body.find(
        (stmt): stmt is ESTree.ReturnStatement =>
          stmt.type === 'ReturnStatement'
      );
      const returnedValue = returnStatement?.argument;

      if (returnedValue?.type === 'ObjectExpression') {
        return filterLiteralKeys(returnedValue.properties);
      }

      return [];
    }
    default:
      return [];
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//-----

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect unused static scopedElements in LitElement.',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-unused-scoped-elements.md'
    },
    schema: [],
    messages: {
      unusedScopedElement:
        "Class {{className}} has unused scoped element '{{tag}}'."
    }
  },

  create(context): Rule.RuleListener {
    const source = context.sourceCode;

    return {
      ClassDeclaration: (node: ESTree.ClassDeclaration): void => {
        const classBody = node.body.body;
        const scopedElementsProp = classBody.find(
          (prop): prop is ESTree.MethodDefinition | ESTree.PropertyDefinition =>
            (prop.type === 'PropertyDefinition' ||
              prop.type === 'MethodDefinition') &&
            prop.static === true &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'scopedElements'
        );

        if (!scopedElementsProp) {
          return;
        }

        const tags = extractTagsFromNode(scopedElementsProp.value);

        const templateStr = classBody
          .flatMap((field) => {
            if (
              (field.type !== 'MethodDefinition' &&
                field.type !== 'PropertyDefinition') ||
              !field.value
            ) {
              return [];
            }

            if (
              (field.value.type === 'FunctionExpression' ||
                field.value.type === 'ArrowFunctionExpression') &&
              field.value.body.type === 'BlockStatement'
            ) {
              return [source.getText(field.value.body)];
            }

            return [];
          })
          .join('');

        const className = node.id?.name ?? 'AnonymousClass';

        tags.forEach((tag) => {
          const tagUsageRegex = new RegExp(`<${tag}[\\s>/]`, 'i');

          if (!tagUsageRegex.test(templateStr)) {
            context.report({
              node: node.id ?? node,
              messageId: 'unusedScopedElement',
              data: {
                className,
                tag
              }
            });
          }
        });
      }
    };
  }
};

export default rule;
