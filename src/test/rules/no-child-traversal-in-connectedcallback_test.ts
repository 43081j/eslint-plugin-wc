/**
 * @fileoverview Disallows traversal of children in the
 * `connectedCallback` method
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-child-traversal-in-connectedcallback';
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

ruleTester.run('no-child-traversal-in-connectedcallback', rule, {
  valid: [
    'const x = 808;',
    'class Foo {}',
    {
      code: `class A extends HTMLElement {
        someMethod() {
          this.querySelector('xyz');
        }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        foo;
      }
    }`
    },
    {
      code: `/**
     * @customElement
     */
    class A extends SomeElement {
      connectedCallback() {
        foo;
      }
    }`
    },
    {
      code: `class A extends SomeElement {
        connectedCallback() {
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
        connectedCallback() {
          foo;
        }
      }`,
      parser
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.textContent = 'foo';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.shadowRoot.textContent = 'foo';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<div></div>';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.shadowRoot.innerHTML = '<div></div>';
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.someOtherThing.querySelector('xyz');
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.addEventListener('foo', () => {
          this.querySelector('woo');
        });
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        this.observer = new MutationObserver((muts) => {
          this.querySelector('woo');
        });
      }
    }`
    }
  ],

  invalid: [
    {
      code: `class A extends HTMLElement {
        connectedCallback() {
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
        connectedCallback() {
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
        connectedCallback() {
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
    },
    {
      code: `class A extends HTMLElement {
        connectedCallback() {
          for (const x of y) {
            this.querySelector('abc');
          }
        }
      }`,
      errors: [
        {
          messageId: 'domMethod',
          line: 4,
          column: 13
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        connectedCallback() {
          foo['bar'](() => {
            this.querySelector('abc');
          });
        }
      }`,
      errors: [
        {
          messageId: 'domMethod',
          line: 4,
          column: 13
        }
      ]
    }
  ]
});
