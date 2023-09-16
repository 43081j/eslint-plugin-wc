/**
 * @fileoverview Disallows extending of built-in elements
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-customized-built-in-elements';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  }
});

const parser = require.resolve('@typescript-eslint/parser');

ruleTester.run('no-customized-built-in-elements', rule, {
  valid: [
    `const x = 808;`,
    `class A extends HTMLElement {}`,
    `class A extends B {}`,
    `/** @customElement */
    class A extends B {}`,
    `/** @customElement */
    class A extends HTMLElement {}`,
    {
      code: `class A extends SomeElement {}`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      }
    }
  ],

  invalid: [
    {
      code: `/** @customElement */ class A extends HTMLParagraphElement {}`,
      errors: [
        {
          messageId: 'noBuiltIn',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `/** @customElement */ class A extends HTMLDivElement {}`,
      errors: [
        {
          messageId: 'noBuiltIn',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `@customElement('x-foo') class A extends HTMLBodyElement {}`,
      parser,
      errors: [
        {
          messageId: 'noBuiltIn',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `/** @customElement */ class A extends HTMLParagraphElement {}`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      },
      errors: [
        {
          messageId: 'noBuiltIn',
          line: 1,
          column: 23
        }
      ]
    }
  ]
});
