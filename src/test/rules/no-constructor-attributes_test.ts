/**
 * @fileoverview Disallows interaction with attributes in constructors
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-constructor-attributes';
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
  'Attributes must not be interacted with in the ' +
  'constructor as the element may not be ready yet.';

ruleTester.run('no-constructor-attributes', rule, {
  valid: [
    {code: `this.hasAttribute('foo')`},
    {code: `this.setAttribute('foo', 'bar')`},
    {code: `this.getAttribute('foo')`},
    {code: `this.removeAttribute('foo')`},
    {code: `this.appendChild(child)`},
    {code: `function foo() { node.appendChild(child); }`},
    {
      code: `class Foo extends HTMLElement {
      constructor(node, n) { node.getAttribute('x'); node.append(n); }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      method(child) { this.hasAttribute('x'); this.removeChild(child); }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      method() { document.write('x'); document.open(url); }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      method() { this.innerHTML = 'foo'; }
    }`
    },
    {
      code: `class NonElement {
      constructor() { this.getAttribute('x'); this.appendChild(c); }
    }`
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.hasAttribute('foo');
          this.getAttribute('foo');
          this.hasAttributes();
          this.removeAttribute('foo');
          this.setAttribute('foo', 'bar');
          this.toggleAttribute('foo');
          console.log(this.attributes[0]);
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        },
        {
          message: errorMessage,
          line: 7,
          column: 11
        },
        {
          message: errorMessage,
          line: 8,
          column: 11
        },
        {
          message: errorMessage,
          line: 9,
          column: 23
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.shadowRoot.hasAttribute('foo');
          this.shadowRoot.getAttribute('foo');
          this.shadowRoot.hasAttributes();
          this.shadowRoot.removeAttribute('foo');
          this.shadowRoot.setAttribute('foo', 'bar');
          this.shadowRoot.toggleAttribute('foo');
          console.log(this.shadowRoot.attributes[0]);
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        },
        {
          message: errorMessage,
          line: 7,
          column: 11
        },
        {
          message: errorMessage,
          line: 8,
          column: 11
        },
        {
          message: errorMessage,
          line: 9,
          column: 23
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          document.write('test');
          document.open(url);
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.innerHTML += 'test';
          this.innerHTML = 'test';
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.shadowRoot.innerHTML += 'test';
          this.shadowRoot.innerHTML = 'test';
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.append(node);
          this.appendChild(node);
          this.removeChild(node);
          this.replaceChild(a, b);
          this.insertBefore(a, b)
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        },
        {
          message: errorMessage,
          line: 7,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.shadowRoot.append(node);
          this.shadowRoot.appendChild(node);
          this.shadowRoot.removeChild(node);
          this.shadowRoot.replaceChild(a, b);
          this.shadowRoot.insertBefore(a, b)
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        },
        {
          message: errorMessage,
          line: 7,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.childNodes[0];
          const x = this.firstChild;
          this.lastChild.innerHTML = 'foo';
          const y = [...this.children];
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 21
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 25
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.shadowRoot.childNodes[0];
          const x = this.shadowRoot.firstChild;
          this.shadowRoot.lastChild.innerHTML = 'foo';
          const y = [...this.shadowRoot.children];
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 21
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 25
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.getElementsByClassName(foo)
          this.getElementsByTagName(foo)
          this.querySelector(foo)
          this.querySelectorAll(foo)
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.shadowRoot.getElementsByClassName(foo)
          this.shadowRoot.getElementsByTagName(foo)
          this.shadowRoot.querySelector(foo)
          this.shadowRoot.querySelectorAll(foo)
        }
      }`,
      errors: [
        {
          message: errorMessage,
          line: 3,
          column: 11
        },
        {
          message: errorMessage,
          line: 4,
          column: 11
        },
        {
          message: errorMessage,
          line: 5,
          column: 11
        },
        {
          message: errorMessage,
          line: 6,
          column: 11
        }
      ]
    },
    {
      code: `/** @customElement **/
      class Foo extends Bar {
        constructor() {
          super();
          this.setAttribute('x', 'y');
        }
      }`,
      errors: [
        {
          message:
            'Attributes must not be interacted with in the ' +
            'constructor as the element may not be ready yet.',
          line: 5,
          column: 11
        }
      ]
    }
  ]
});
