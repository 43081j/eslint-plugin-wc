/**
 * @fileoverview Enforces a maximum number of elements per file
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import {fileURLToPath} from 'node:url';
import rule from '../../rules/max-elements-per-file.js';
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

const parser = fileURLToPath(import.meta.resolve('@typescript-eslint/parser'));

ruleTester.run('max-elements-per-file', rule, {
  valid: [
    'const x = 505;',
    {
      code: 'class A extends HTMLElement {}'
    },
    {
      code: `
        class A extends HTMLElement {}
        class B extends HTMLElement {}
      `,
      options: [
        {
          max: 2
        }
      ]
    },
    {
      code: `/**
     * @customElement
     */
    class A extends Element {}`
    },
    {
      code: 'class A extends SomeElement {}',
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      }
    },
    {
      code: `@customElement('x-foo')
      class A extends SomeElement {}`,
      parser
    }
  ],

  invalid: [
    {
      code: `
        class A extends HTMLElement {}
        class B extends HTMLElement {}
      `,
      errors: [
        {
          messageId: 'tooMany',
          data: {count: 1},
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `
        class A extends HTMLElement {}
        class B extends HTMLElement {}
        class C extends HTMLElement {}
      `,
      options: [
        {
          max: 2
        }
      ],
      errors: [
        {
          messageId: 'tooMany',
          data: {count: 2},
          line: 4,
          column: 9
        }
      ]
    },
    {
      code: `
        class A extends SomeElement {}
        class B extends SomeElement {}
      `,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      },
      errors: [
        {
          messageId: 'tooMany',
          data: {count: 1},
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `
        /**
         * @customElement
         */
        class A extends SomeElement {}
        class B extends HTMLElement {}
      `,
      errors: [
        {
          messageId: 'tooMany',
          line: 6,
          column: 9
        }
      ]
    },
    {
      code: `
        @customElement('x-a')
        class A extends SomeElement {}
        class B extends HTMLElement {}
      `,
      parser,
      errors: [
        {
          messageId: 'tooMany',
          line: 4,
          column: 9
        }
      ]
    }
  ]
});
