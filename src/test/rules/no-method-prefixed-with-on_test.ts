/**
 * @fileoverview Disallows methods prefixed with `on`
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import {fileURLToPath} from 'node:url';
import rule from '../../rules/no-method-prefixed-with-on.js';
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

ruleTester.run('no-method-prefixed-with-on', rule, {
  valid: [
    'class A {}',
    'const x = 303;',
    {
      code: `class A {
        onFoo() {
        }
      }`
    },
    {
      code: `class A extends B {
        onFoo() {
        }
      }`
    },
    {
      code: `class A {
        onfoo() {
        }
      }`
    },
    {
      code: `class A extends HTMLElement {
        someMethod() {
        }
      }`
    },
    {
      code: `class A extends HTMLElement {
        [onSomethingButImAConst]() {
        }
      }`
    }
  ],

  invalid: [
    {
      code: `class A extends HTMLElement {
        onFoo() {
        }
      }`,
      errors: [
        {
          messageId: 'noPrefix',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        onfoo() {
        }
      }`,
      errors: [
        {
          messageId: 'noPrefix',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `class A extends SomeElement {
        onFoo() {
        }
      }`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      },
      errors: [
        {
          messageId: 'noPrefix',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `/**
       * @customElement
       */
      class A extends SomeElement {
        onFoo() {
        }
      }`,
      errors: [
        {
          messageId: 'noPrefix',
          line: 5,
          column: 9
        }
      ]
    },
    {
      code: `@customElement('x-foo')
      class A extends SomeElement {
        onFoo() {
        }
      }`,
      parser,
      errors: [
        {
          messageId: 'noPrefix',
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        ['onFoo']() {
        }
      }`,
      errors: [
        {
          messageId: 'noPrefix',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        #onFoo() {
        }
      }`,
      parser,
      errors: [
        {
          messageId: 'noPrefix',
          line: 2,
          column: 9
        }
      ]
    }
  ]
});
