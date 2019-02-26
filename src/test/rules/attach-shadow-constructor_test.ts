/**
 * @fileoverview Disallows attaching shadow root outside of the constructor
 * @author Michael Stramel <https://github.com/stramel>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/attach-shadow-constructor';
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
  'Attaching a Shadow Root should only occur in the constructor of an element.';

ruleTester.run('attach-shadow-constructor', rule, {
  valid: [
    {
      code: `class A extends HTMLElement {
      constructor() {
        super();
        this.attachShadow();
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      constructor() {
        super();
        if (true) {
          this.attachShadow();
        }
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open'});
      }
    }`
    },
    {
      code: `class A extends HTMLElement {
      initialize(node) {
        node.attachShadow({ mode: 'open'});
      }
    }`
    },
    {
      code: `/**
     * @customElement
     */
    class A extends Element {
      constructor() {
        this.attachShadow();
      }
    }`
    },
    {
      code: `class A extends Element {
        connectedCallback() {
          this.attachShadow();
        }
      }`
    }
  ],

  invalid: [
    {
      code: `class A extends HTMLElement {
        connectedCallback() {
          this.attachShadow();
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class A extends HTMLElement {
        initialize() {
          this.attachShadow();
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `/**
       * @customElement
       */
      class A extends Element {
        connectedCallback() {
          this.attachShadow();
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 6,
          column: 11
        }
      ]
    }
  ]
});
