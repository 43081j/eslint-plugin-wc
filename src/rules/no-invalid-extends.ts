/**
 * @fileoverview Disallows invalid class inheritance for custom elements
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement} from '../util';
import {isDefineCall} from '../util/customElements';
import {resolveReference} from '../util/ast';
import {builtInTagClassMap} from '../util/tag-names';

/**
 * Computes the `extends` option from a `customElements.define` third
 * argument.
 * @param {ESTree.Node} node Node to compute value for
 * @return {string|null}
 */
function getExtendsOption(node: ESTree.Node): string | null {
  if (node.type !== 'ObjectExpression') {
    return null;
  }

  const extendsOption = node.properties.find(
    (prop): prop is ESTree.Property =>
      prop.type === 'Property' &&
      ((prop.key.type === 'Literal' && prop.key.value === 'extends') ||
        (prop.key.type === 'Identifier' && prop.key.name === 'extends'))
  );

  if (!extendsOption) {
    return null;
  }

  const value = extendsOption.value;

  if (value.type === 'Literal') {
    return String(value.value);
  }

  if (value.type === 'TemplateLiteral' && value.expressions.length === 0) {
    return value.quasis.map((quasi) => quasi.value.raw).join('');
  }

  return null;
}

const formatter = new Intl.ListFormat('en', {
  style: 'short',
  type: 'disjunction'
});

/**
 * Formats a set of names to be human-readable
 * @param {Iterable<string>} names Names to format
 * @return {string}
 */
function formatNames(names: Iterable<string>): string {
  return formatter.format(names);
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows invalid class inheritance for custom elements',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-invalid-extends.md'
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowedSuperNames: {
            type: 'array',
            items: {type: 'string'}
          }
        }
      }
    ],
    messages: {
      invalid: 'Custom element must extend {{allowedSuperNames}}',
      invalidOrMissingExtends:
        'Custom element must extend {{allowedSuperNames}}, or pass ' +
        "{extends: '{{expectedExtends}}'} as a third argument to `define`",
      invalidExtends:
        'Custom element extends {{superName}} but the definition includes ' +
        "{extends: '{{actualExtends}}'}. Either the element must extend " +
        '{{allowedSuperNames}} or the definition must include ' +
        "{extends: '{{expectedExtends}}'}.",
      unknownExtends:
        'Custom element extends {{superName}} but the definition includes ' +
        "{extends: '{{actualExtends}}'}, which is an unknown built-in. " +
        'You should probably remove the `extends` option.'
    }
  },

  create(context): Rule.RuleListener {
    const source = context.getSourceCode();
    const elementClasses = new Set<ESTree.Class>();
    const userAllowedSuperNames = context.options[0]?.allowedSuperNames ?? [];

    return {
      'ClassExpression,ClassDeclaration': (node: ESTree.Class): void => {
        if (isCustomElement(context, node, source.getJSDocComment(node))) {
          elementClasses.add(node);
        }
      },
      CallExpression: (node: ESTree.CallExpression): void => {
        if (!isDefineCall(node) || node.arguments.length < 2) {
          return;
        }

        const [, arg1, arg2] = node.arguments;
        const classRef = resolveReference(arg1, context);

        if (
          !classRef ||
          (classRef.type !== 'ClassExpression' &&
            classRef.type !== 'ClassDeclaration') ||
          !elementClasses.has(classRef)
        ) {
          return;
        }

        const extendsTag = arg2 && getExtendsOption(arg2);
        let allowedSuperNames: Set<string>;

        if (
          extendsTag !== null &&
          builtInTagClassMap[extendsTag as keyof HTMLElementTagNameMap]
        ) {
          allowedSuperNames = new Set<string>([
            builtInTagClassMap[extendsTag as keyof HTMLElementTagNameMap]
          ]);
        } else {
          allowedSuperNames = new Set<string>(userAllowedSuperNames);
          allowedSuperNames.add('HTMLElement');
        }

        const formattedSuperNames = formatNames(allowedSuperNames);

        if (!classRef.superClass) {
          context.report({
            node,
            messageId: 'invalid',
            data: {
              allowedSuperNames: formattedSuperNames
            }
          });
          return;
        }

        // We can't handle funky subclasses, like mixins and other such
        // chaos
        if (classRef.superClass.type !== 'Identifier') {
          return;
        }

        const superName = classRef.superClass.name;

        if (!allowedSuperNames.has(superName)) {
          const expectedExtends = Object.entries(builtInTagClassMap).find(
            (entry) => entry[1] === superName
          )?.[0];

          if (extendsTag && !expectedExtends) {
            // the class extends something that isn't built-in, but specifies
            // an `extends`
            context.report({
              node,
              messageId: 'unknownExtends',
              data: {
                allowedSuperNames: formattedSuperNames,
                superName,
                actualExtends: extendsTag
              }
            });
          } else if (!extendsTag && expectedExtends) {
            // the class inherits a built-in but doesn't specify `extends`
            context.report({
              node,
              messageId: 'invalidOrMissingExtends',
              data: {
                allowedSuperNames: formattedSuperNames,
                expectedExtends
              }
            });
          } else if (
            extendsTag &&
            extendsTag !== expectedExtends &&
            expectedExtends
          ) {
            // the class inherits a built-in and specifies `extends`, but it
            // is the wrong value
            context.report({
              node,
              messageId: 'invalidExtends',
              data: {
                actualExtends: extendsTag,
                expectedExtends,
                allowedSuperNames: formattedSuperNames,
                superName
              }
            });
          } else {
            // the class extends some non-built-in class we don't allow
            context.report({
              node,
              messageId: 'invalid',
              data: {
                allowedSuperNames: formattedSuperNames
              }
            });
          }
        }
      }
    };
  }
};

export default rule;
