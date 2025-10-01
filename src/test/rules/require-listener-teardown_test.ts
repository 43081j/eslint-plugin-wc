/**
 * @fileoverview Requires that listeners be cleaned up on DOM disconnect
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/require-listener-teardown.js';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015
    }
  }
});

ruleTester.run('require-listener-teardown', rule, {
  valid: [
    {
      code: `class Foo extends HTMLElement {
      connectedCallback() {
        this.addEventListener('x', console.log);
      }
      disconnectedCallback() {
        this.removeEventListener('x', console.log);
      }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      unknownMethod() {
        this.addEventListener('x', console.log);
      }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      connectedCallback() {
        this.addEventListener(notAString, console.log);
      }
    }`
    },
    {code: `class Foo extends HTMLElement {}`},
    {
      code: `class Foo extends Unknown {
      connectedCallback() {
        this.addEventListener('x', console.log);
      }
      disconnectedCallback() {
        this.removeEventListener('x', console.log);
      }
    }`
    },
    // TODO (43081j): one day add some more accuracy so we can also
    // detect this case as invalid
    {
      code: `class Foo extends Unknown {
      connectedCallback() {
        this.something.addEventListener('x', console.log);
      }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      connectedCallback() {
        this.addEventListener('foo', console.log);
      }
    }`,
      options: [
        {
          hosts: ['window', 'document']
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
      constructor() {
        this.controller = new AbortController();
        this.signal = this.controller.signal;
      }
      connectedCallback() {
        this.addEventListener('x', console.log, { signal: this.signal });
      }
      disconnectedCallback() {
        this.controller.abort();
      }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      constructor() {
        this.controller = new AbortController();
      }
      connectedCallback() {
        const {signal} = this.controller;
        this.addEventListener('x', console.log, { signal });
      }
      disconnectedCallback() {
        this.controller.abort();
      }
    }`
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
        disconnectedCallback() {
          this.removeEventListener(notAString, console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
        disconnectedCallback() {
          foo.removeEventListener('x', console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends Unknown {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `const foo = class extends HTMLElement {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `const foo = class extends Unknown {
        connectedCallback() {
          this.addEventListener('x', console.log);
        }
      }`,
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HMTLElement {
        connectedCallback() {
          foo.addEventListener('x', console.log);
        }
      }`,
      options: [
        {
          hosts: ['foo']
        }
      ],
      errors: [
        {
          messageId: 'noTeardown',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HMTLElement {
        connectedCallback() {
          this.addEventListener('x', this.foo.bind(this));
        }
        disconnectedCallback() {
          this.removeEventListener('x', this.foo.bind(this));
        }
      }`,
      errors: [
        {
          messageId: 'noArrowBind',
          line: 3,
          column: 38
        },
        {
          messageId: 'noArrowBind',
          line: 6,
          column: 41
        }
      ]
    },
    {
      code: `class Foo extends HMTLElement {
        connectedCallback() {
          this.addEventListener('x', () => {});
        }
        disconnectedCallback() {
          this.removeEventListener('x', () => {});
        }
      }`,
      errors: [
        {
          messageId: 'noArrowBind',
          line: 3,
          column: 38
        },
        {
          messageId: 'noArrowBind',
          line: 6,
          column: 41
        }
      ]
    }
  ]
});
