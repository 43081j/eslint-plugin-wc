/**
 * @fileoverview Disallows invalid custom element names
 * @author Michael Stramel <https://github.com/stramel>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import isValidElementName from 'is-valid-element-name';
import {knownNamespaces} from '../util/tag-names.js';
import {isDefineCall} from '../util/customElements.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows invalid custom element names',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/no-invalid-element-name.md'
    },
    messages: {
      invalidElementName:
        "Element name is invalid and should follow the HTML standard's recommendations" +
        '(https://html.spec.whatwg.org/multipage/custom-elements.html#prod-potentialcustomelementname). ' +
        '{{hints}}',
      disallowedNamespace:
        'Element name is using a well known/reserved namespace ({{prefix}}). ' +
        'You should use another namespace to avoid conflicts',
      requiredPrefix:
        'Element name must be prefixed with one of the following namespaces: ' +
        '{{prefixes}}',
      requiredSuffix:
        'Element name must be suffixes with one of the following namespaces: ' +
        '{{suffixes}}',
      onlyAlphanum:
        'Element name must only contain alpha-numeric characters and hyphens',
      dashes:
        'Element name should not contain multiple consecutive hyphens and ' +
        'should not start or end with a hyphen'
    },
    schema: [
      {
        type: 'object',
        properties: {
          onlyAlphanum: {type: 'boolean'},
          disallowNamespaces: {type: 'boolean'},
          suffix: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          prefix: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const onlyAlphanum = context.options[0]?.onlyAlphanum === true;
    const disallowNamespaces = context.options[0]?.disallowNamespaces === true;
    const suffixes = (context.options[0]?.suffix ?? []) as string[];
    const prefixes = (context.options[0]?.prefix ?? []) as string[];
    const startsWithLetter = /^[a-z]/;
    const containsUpperCase = /[A-Z]/;
    const containsOnlyAlpha = /^[a-z0-9-]+$/;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node: ESTree.CallExpression): void => {
        if (isDefineCall(node)) {
          const firstArg = node.arguments[0];
          if (
            firstArg &&
            firstArg.type === 'Literal' &&
            typeof firstArg.value === 'string'
          ) {
            const tagName = firstArg.value;
            const validationResult = isValidElementName(tagName);

            if (!validationResult) {
              const hints: string[] = [];

              if (!startsWithLetter.test(tagName)) {
                hints.push('Name must start with a letter');
              }

              if (!tagName.includes('-')) {
                hints.push('Name must contain a hyphen/dash');
              }

              if (containsUpperCase.test(tagName)) {
                hints.push('Name must contain only lowercase characters');
              }

              context.report({
                messageId: 'invalidElementName',
                node: firstArg,
                data: {hints: hints.join('. ')}
              });
            }

            const tagPrefix = tagName.slice(0, tagName.indexOf('-'));
            const matchesSuffixes = suffixes.some((suffix) =>
              tagName.endsWith(suffix)
            );
            const matchesPrefixes = prefixes.some((prefix) =>
              tagName.startsWith(prefix)
            );

            if (tagName.includes('--') || tagName.endsWith('-')) {
              context.report({
                messageId: 'dashes',
                node: firstArg
              });
            }

            if (suffixes.length > 0 && !matchesSuffixes) {
              context.report({
                messageId: 'requiredSuffix',
                data: {suffixes: suffixes.join(', ')},
                node: firstArg
              });
            }

            if (prefixes.length > 0 && !matchesPrefixes) {
              context.report({
                messageId: 'requiredPrefix',
                data: {prefixes: prefixes.join(', ')},
                node: firstArg
              });
            }

            if (disallowNamespaces && knownNamespaces.has(tagPrefix)) {
              context.report({
                messageId: 'disallowedNamespace',
                data: {prefix: tagPrefix},
                node: firstArg
              });
            }

            if (onlyAlphanum && !containsOnlyAlpha.test(tagName)) {
              context.report({
                messageId: 'onlyAlphanum',
                node: firstArg
              });
            }
          }
        }
      }
    };
  }
};

export default rule;
