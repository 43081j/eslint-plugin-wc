/**
 * @fileoverview Requires a guard before calling a super method inside a
 *  Custom Element Lifecycle hook
 * @author Michael Stramel <https://github.com/stramel>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/guard-super-call';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module'
  }
});

const errorMessage =
  'Super calls to lifecycle callbacks should be guarded in case the base class does not implement them';

ruleTester.run('guard-super-call', rule, {
  valid: [
    {
      code: `class A extends HTMLElement {
      connectedCallback() {}
      disconnectedCallback() {}
      adoptedCallback() {}
      attributeChangedCallback() {}
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
      }
      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.connectedCallback();
        }
      }
      adoptedCallback() {
        doSomething();
        if (super.adoptedCallback) super.adoptedCallback();
      }
      attributeChangedCallback() {
        doSomething();
        if (super.attributeChangedCallback) {
          super.attributeChangedCallback();
        }
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      connectedCallback() {
        doSomething();
        if (super.connectedCallback) {
          doAnotherThing();
          super.connectedCallback();
        }

      }
      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
      }
    }`
    },
    {
      code: `/**
     * @customElement
     */
    class A extends Element {
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }
      disconnectedCallback() {
        if (super.disconnectedCallback)
          super.disconnectedCallback();
      }
      adoptedCallback() {
        if (super.adoptedCallback) super.adoptedCallback();
      }
      attributeChangedCallback() {
        super.attributeChangedCallback &&
          super.attributeChangedCallback();
      }
    }`
    }
  ],

  invalid: [
    {
      code: `/**
       * @customElement
       */
      class A extends Element {
        connectedCallback() {
          super.connectedCallback();
        }
        disconnectedCallback() {
          if (true)
            super.disconnectedCallback();
        }
        adoptedCallback() {
          if (true) {
            super.adoptedCallback();
          }
        }
        attributeChangedCallback() {
          super.attributeChangedCallback();
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 6,
          column: 11
        },
        {
          message: errorMessage,
          line: 10,
          column: 13
        },
        {
          message: errorMessage,
          line: 14,
          column: 13
        },
        {
          message: errorMessage,
          line: 18,
          column: 11
        }
      ]
    }
  ]
});
