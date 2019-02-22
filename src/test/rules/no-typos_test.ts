/**
 * @fileoverview Detects misspellings of common features
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-typos';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module'
  }
});

ruleTester.run('no-typos', rule, {
  valid: [
    {
      code: `class Foo extends HTMLElement {
      connectedCallback() {}
      disconnectedCallback() {}
      adoptedCallback() {}
      attributeChangedCallback() {}
    }`
    },
    {
      code: `class Foo {
      connectCallback() {}
      connectedCallbac() {}
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      observedAttributes() {}
    }`
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        onnectedCallback() {}
        isconnectedCallback() {}
        doptedCallback() {}
        ttributeChangedCallback() {}
      }`,
      errors: [
        {
          message:
            'Method name is likely a misspelling, did you mean "connectedCallback"?',
          line: 2,
          column: 9
        },
        {
          message:
            'Method name is likely a misspelling, did you mean "disconnectedCallback"?',
          line: 3,
          column: 9
        },
        {
          message:
            'Method name is likely a misspelling, did you mean "adoptedCallback"?',
          line: 4,
          column: 9
        },
        {
          message:
            'Method name is likely a misspelling, did you mean "attributeChangedCallback"?',
          line: 5,
          column: 9
        }
      ]
    },
    {
      code: `/** @customElement **/
        class Foo extends Bar {
          onnectedCallback() {}
        }`,
      errors: [
        {
          message:
            'Method name is likely a misspelling, did you mean "connectedCallback"?',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        connectedCallbac() {}
        connectedCallbackk() {}
        connectedWallback() {}
      }`,
      errors: [
        {
          message:
            'Method name is likely a misspelling, did you mean "connectedCallback"?',
          line: 2,
          column: 9
        },
        {
          message:
            'Method name is likely a misspelling, did you mean "connectedCallback"?',
          line: 3,
          column: 9
        },
        {
          message:
            'Method name is likely a misspelling, did you mean "connectedCallback"?',
          line: 4,
          column: 9
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        static get observedAtributes() {}
      }`,
      errors: [
        {
          message:
            'Member name is likely a misspelling, did you mean "observedAttributes"?',
          line: 2,
          column: 20
        }
      ]
    },
    {
      code: `/** @customElement **/
        class Foo extends HTMLElement {
          static get observedAtributes() {}
        }`,
      errors: [
        {
          message:
            'Member name is likely a misspelling, did you mean "observedAttributes"?',
          line: 3,
          column: 22
        }
      ]
    }
  ]
});
