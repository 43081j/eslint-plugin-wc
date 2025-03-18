/**
 * @fileoverview Disallows constructors in custom element classes
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import {fileURLToPath} from 'node:url';
import rule from '../../rules/no-constructor.js';
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

ruleTester.run('no-constructor', rule, {
  valid: [
    {
      code: `class A {
      constructor() {
      }
    }`
    },
    {
      code: `class A extends B {
      constructor() {
        super();
      }
    }`
    }
  ],

  invalid: [
    {
      code: `class A extends HTMLElement {
        constructor() {
          super();
        }
      }`,
      errors: [
        {
          messageId: 'noConstructor',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `class A extends Element {
        constructor() {
          super();
        }
      }`,
      settings: {
        wc: {
          elementBaseClasses: ['Element']
        }
      },
      errors: [
        {
          messageId: 'noConstructor',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `/**
       * @customElement
       */
      class A extends Element {
        constructor() {
          super();
        }
      }`,
      errors: [
        {
          messageId: 'noConstructor',
          line: 5,
          column: 9
        }
      ]
    },
    {
      code: `@customElement('x-foo')
      class A extends Element {
        constructor() {
          super();
        }
      }`,
      parser,
      errors: [
        {
          messageId: 'noConstructor',
          line: 3,
          column: 9
        }
      ]
    }
  ]
});
