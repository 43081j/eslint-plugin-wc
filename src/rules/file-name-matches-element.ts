/**
 * @fileoverview Enforces that the filename of a file containing an element
 * matches that of its class name
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';
import {isCustomElement, coerceArray} from '../util.js';
import * as path from 'path';
import {toCaseByType} from '../util/text.js';

/**
 * Computes a set of prefixed/suffixed names for a given name
 * @param {string} name Name to generate names for
 * @param {Iterable<string>} prefixes Prefixes to apply
 * @param {Iterable<string>} suffixes Suffixes to apply
 */
function* computeNames(
  name: string,
  prefixes: Iterable<string>,
  suffixes: Iterable<string>
): Generator<string> {
  const lowerName = name.toLowerCase();

  for (const prefix of prefixes) {
    if (lowerName.startsWith(prefix.toLowerCase())) {
      const truncated = name.slice(prefix.length);
      yield truncated;

      for (const suffix of suffixes) {
        if (truncated.toLowerCase().endsWith(suffix.toLowerCase())) {
          yield truncated.slice(0, truncated.length - suffix.length);
        }
      }
    }
  }

  for (const suffix of suffixes) {
    if (lowerName.endsWith(suffix.toLowerCase())) {
      const truncated = name.slice(0, name.length - suffix.length);
      yield truncated;

      for (const prefix of prefixes) {
        if (truncated.toLowerCase().startsWith(prefix.toLowerCase())) {
          yield truncated.slice(prefix.length);
        }
      }
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        'Enforces that the filename of a file containing an element' +
        'matches that of its class name',
      url: 'https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/file-name-matches-element.md'
    },
    messages: {
      fileMismatch: 'File name should be "{{expected}}" but was "{{actual}}"'
    },
    schema: [
      {
        type: 'object',
        properties: {
          transform: {
            oneOf: [
              {
                enum: ['none', 'snake', 'kebab', 'pascal', 'camel']
              },
              {
                type: 'array',
                items: {
                  enum: ['none', 'snake', 'kebab', 'pascal', 'camel']
                },
                minItem: 1,
                maxItems: 4
              }
            ]
          },
          prefix: {
            oneOf: [
              {
                type: 'string'
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          },
          suffix: {
            oneOf: [
              {
                type: 'string'
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          },
          matchDirectory: {
            type: 'boolean'
          }
        }
      }
    ]
  },

  create(context): Rule.RuleListener {
    const source = context.sourceCode;
    const options = context.options?.[0] ?? {};
    const userSuffixes = coerceArray(options.suffix ?? []);
    const userPrefixes = coerceArray(options.prefix ?? []);
    const transforms = coerceArray(options.transform ?? ['kebab', 'camel']);
    const matchDirectory = options.matchDirectory === true;

    const filename = context.filename;

    // We don't want to match stdin and what not
    if (!filename || filename === '<input>' || filename === '<text>') {
      return {};
    }

    return {
      'ClassDeclaration,ClassExpression': (node: ESTree.Class): void => {
        if (!isCustomElement(context, node, source.getJSDocComment(node))) {
          return;
        }

        if (!node.id) {
          return;
        }

        const className = node.id.name;
        const normalisedFilename = path.basename(
          filename,
          path.extname(filename)
        );
        const names = new Set<string>([className]);
        const prefixes = new Set<string>(userPrefixes);
        const suffixes = new Set<string>(userSuffixes);

        if (matchDirectory) {
          const fileDir = path.dirname(filename);
          const parts = fileDir.toLowerCase().split(path.sep);

          while (parts.length) {
            prefixes.add(parts.join(''));
            parts.shift();
          }
        }

        for (const possibleName of computeNames(
          className,
          prefixes,
          suffixes
        )) {
          names.add(possibleName);
        }

        const allowedFileNames = new Set<string>();

        for (const possibleName of names) {
          for (const transform of transforms) {
            allowedFileNames.add(toCaseByType(possibleName, transform));
          }
        }

        if (
          allowedFileNames.size > 0 &&
          !allowedFileNames.has(normalisedFilename)
        ) {
          const allowedNames = [...allowedFileNames].join('" or "');
          context.report({
            node: node.id,
            messageId: 'fileMismatch',
            data: {
              expected: allowedNames,
              actual: normalisedFilename
            }
          });
        }
      }
    };
  }
};

export default rule;
