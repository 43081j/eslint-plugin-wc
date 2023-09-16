/**
 * @fileoverview Enforces that the tag name of a custom element matches its
 * class name
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {coerceArray} from '../util';
import {toKebabCase} from '../util/text';

/**
 * Removes a set of prefixes and suffixes from a string if it contains them
 * @param {string} str String to mutate
 * @param {string[]} prefixes Prefixes to strip
 * @param {string[]} suffixes Suffixes to strip
 * @return {string}
 */
function removePrefixesAndSuffixes(
  str: string,
  prefixes: string[],
  suffixes: string[]
): string {
  for (const prefix of prefixes) {
    if (str.startsWith(prefix)) {
      str = str.slice(prefix.length);
    }
  }
  for (const suffix of suffixes) {
    if (str.endsWith(suffix)) {
      str = str.slice(0, -suffix.length);
    }
  }
  return str;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Enforces that the tag name of a custom element matches its class name',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/tag-name-matches-class.md'
    },
    messages: {
      nameMismatch:
        'Custom element tag name should have been {{expected}} but ' +
        'was {{actual}}'
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          suffix: {
            oneOf: [{type: 'string'}, {type: 'array', items: {type: 'string'}}]
          },
          prefix: {
            oneOf: [{type: 'string'}, {type: 'array', items: {type: 'string'}}]
          }
        }
      }
    ]
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const suffixes = coerceArray(context.options[0]?.suffix ?? []);
    const prefixes = coerceArray(context.options[0]?.prefix ?? []);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.CallExpression): void => {
        if (
          node.callee.type === 'MemberExpression' &&
          ((node.callee.object.type === 'MemberExpression' &&
            node.callee.object.object.type === 'Identifier' &&
            node.callee.object.object.name === 'window' &&
            node.callee.object.property.type === 'Identifier' &&
            node.callee.object.property.name === 'customElements') ||
            (node.callee.object.type === 'Identifier' &&
              node.callee.object.name === 'customElements')) &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'define'
        ) {
          const [firstArg, secondArg] = node.arguments;

          if (
            firstArg &&
            firstArg.type === 'Literal' &&
            typeof firstArg.value === 'string' &&
            (secondArg.type === 'Identifier' ||
              secondArg.type === 'ClassExpression')
          ) {
            const tagName = firstArg.value;
            const className =
              secondArg.type === 'Identifier'
                ? secondArg.name
                : secondArg.id?.name;

            if (!className) {
              return;
            }

            const classNameWithoutPrefixesAndSuffixes =
              removePrefixesAndSuffixes(className, prefixes, suffixes);
            const expected = toKebabCase(classNameWithoutPrefixesAndSuffixes);

            if (tagName !== expected) {
              context.report({
                node,
                messageId: 'nameMismatch',
                data: {
                  expected,
                  actual: tagName
                }
              });
            }
          }
        }
      }
    };
  }
};

export default rule;
