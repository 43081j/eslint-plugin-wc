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
          this.accessKey = 'z';
          this.autocapitalize = 'on';
          this.className = 'foo';
          this.contentEditable = 'true';
          this.dir = 'rtl';
          this.draggable = 'true';
          this.hidden = 'true';
          this.id = 'foo';
          this.lang = 'foo';
          this.slot = 'foo';
          this.spellcheck = 'true';
          this.style = 'color: blue';
          this.tabIndex = 42;
          this.title = 'foo';
          this.translate = 'true';
        }
      }`,
      errors: [
        {messageId: 'constructorAttrs', line: 3, column: 11},
        {messageId: 'constructorAttrs', line: 4, column: 11},
        {messageId: 'constructorAttrs', line: 5, column: 11},
        {messageId: 'constructorAttrs', line: 6, column: 11},
        {messageId: 'constructorAttrs', line: 7, column: 11},
        {messageId: 'constructorAttrs', line: 8, column: 11},
        {messageId: 'constructorAttrs', line: 9, column: 11},
        {messageId: 'constructorAttrs', line: 10, column: 11},
        {messageId: 'constructorAttrs', line: 11, column: 11},
        {messageId: 'constructorAttrs', line: 12, column: 11},
        {messageId: 'constructorAttrs', line: 13, column: 11},
        {messageId: 'constructorAttrs', line: 14, column: 11},
        {messageId: 'constructorAttrs', line: 15, column: 11},
        {messageId: 'constructorAttrs', line: 16, column: 11},
        {messageId: 'constructorAttrs', line: 17, column: 11}
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.classList.toggle('foo');
          this.classList.add('foo');
          this.classList.remove('foo');
          const foo = this.classList;
        }
      }`,
      errors: [
        {messageId: 'constructorAttrs', line: 3, column: 11},
        {messageId: 'constructorAttrs', line: 4, column: 11},
        {messageId: 'constructorAttrs', line: 5, column: 11},
        {messageId: 'constructorAttrs', line: 6, column: 23}
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.dataset['foo'] = 'bar';
          const foo = this.dataset['foo'];
          const bar = this.dataset;
        }
      }`,
      errors: [
        {messageId: 'constructorAttrs', line: 3, column: 11},
        {messageId: 'constructorAttrs', line: 4, column: 23},
        {messageId: 'constructorAttrs', line: 5, column: 23}
      ]
    },
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 6,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 7,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 8,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 6,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 7,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 8,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 6,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 6,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 21
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 21
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
          messageId: 'constructorAttrs',
          line: 3,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 4,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
          line: 5,
          column: 11
        },
        {
          messageId: 'constructorAttrs',
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
    },
    {
      code: `@customElement('x-foo')
      class Foo extends Bar {
        constructor() {
          super();
          this.setAttribute('x', 'y');
        }
      }`,
      parser: '@typescript-eslint/parser',
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
