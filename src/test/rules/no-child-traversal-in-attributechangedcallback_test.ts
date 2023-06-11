/**
 * @fileoverview Disallows traversal of children in the
 * `AttributeChangedCallback` method
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-child-traversal-in-attributechangedcallback';
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

ruleTester.run('no-child-traversal-in-attributechangedcallback', rule, {
  valid: [
    'const x = 808;',
    {
      code: `class A extends HTMLElement {
        someMethod() {
          this.querySelector('xyz');
        }
    }`
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        foo;
      }
    }`
    },
    {
      code: `/**
     * @customElement
     */
    class A extends SomeElement {
      attributeChangedCallback() {
        foo;
      }
    }`
    },
    {
      code: `class A extends SomeElement {
        attributeChangedCallback() {
          foo;
        }
      }`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      }
    },
    {
      code: `@customElement('x-foo')
      class A extends SomeElement {
        attributeChangedCallback() {
          foo;
        }
      }`,
      parser
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        this.textContent = 'foo';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        this.shadowRoot.textContent = 'foo';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        this.innerHTML = '<div></div>';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        this.shadowRoot.innerHTML = '<div></div>';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      attributeChangedCallback() {
        this.someOtherThing.querySelector('xyz');
      }
    }`
    }
  ],

  invalid: [
    {
      code: `class A extends HTMLElement {
        attributeChangedCallback() {
          this.shadowRoot.querySelector('foo');
        }
      }`,
      errors: [
        {
          messageId: 'domMethod',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        attributeChangedCallback() {
          this.querySelector('foo');
        }
      }`,
      errors: [
        {
          messageId: 'domMethod',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        attributeChangedCallback() {
          const foo = this.children[0];
        }
      }`,
      errors: [
        {
          messageId: 'domProp',
          line: 3,
          column: 23
        }
      ]
    }
  ]
});
