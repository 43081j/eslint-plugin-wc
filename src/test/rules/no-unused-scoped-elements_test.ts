/**
 * @fileoverview Disallows unused entries in static scopedElements
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-unused-scoped-elements.js';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022
    }
  }
});

const scopedElementsProperty = (tag: string): string => `
  static scopedElements = {
    '${tag}': MyTag
  };
`;

const scopedElementsGetter = (tag: string): string => `
  static get scopedElements() {
    return {
      '${tag}': MyTag
    };
  }
`;

const renderMethod = (template: string): string => `
  render() {
    return html\`${template}\`;
  }
`;

ruleTester.run('no-unused-scoped-elements', rule, {
  valid: [
    {
      code: `
        class MyPage {
          ${scopedElementsProperty('my-tag')}
          ${renderMethod('<my-tag></my-tag>')}
        }
      `
    },
    {
      code: `
        class MyPage {
          ${scopedElementsGetter('my-tag')}
          ${renderMethod('<my-tag></my-tag>')}
        }
      `
    },
    {
      code: `
        class MyPage {
          ${scopedElementsProperty('my-tag')}

          renderHelper() {
            return html\`<my-tag></my-tag>\`;
          }

          render() {
            return this.renderHelper();
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          ${scopedElementsGetter('my-tag')}

          renderHelper() {
            return html\`<my-tag></my-tag>\`;
          }

          render() {
            return this.renderHelper();
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static scopedElements = {
            myTag: MyTag
          };

          render() {
            return html\`<my-tag></my-tag>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static get scopedElements() {
            return getScoped();
          }

          render() {
            return html\`<div></div>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static scopedElements = {
            'my-tag': MyTag,
            ...super.scopedElements
          };

          render() {
            return html\`<my-tag></my-tag>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static get scopedElements() {
            return {
              'my-tag': MyTag,
              ...super.scopedElements
            };
          }

          render() {
            return html\`<my-tag></my-tag>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          scopedElements = {
            myTag: MyTag
          };

          render() {
            return html\`<div></div>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static scopedElements = null;

          render() {
            return html\`<div></div>\`;
          }
        }
      `
    },
    {
      code: `
        class MyPage {
          static scopedElements = {};

          render() {
            return html\`<div></div>\`;
          }
        }
      `
    }
  ],

  invalid: [
    {
      code: `
        class MyPage {
          static scopedElements = {
            'unused-tag': UnusedTag
          };

          render() {
            return html\`<div></div>\`;
          }
        }
      `,
      errors: [
        {
          messageId: 'unusedScopedElement',
          data: {
            className: 'MyPage',
            tag: 'unused-tag'
          }
        }
      ]
    },
    {
      code: `
        class MyPage {
          static get scopedElements() {
            return {
              'unused-tag': UnusedTag
            };
          }

          render() {
            return html\`<div></div>\`;
          }
        }
      `,
      errors: [
        {
          messageId: 'unusedScopedElement',
          data: {
            className: 'MyPage',
            tag: 'unused-tag'
          }
        }
      ]
    },
    {
      code: `
        class MyPage {
          static scopedElements = {
            'unused-tag': UnusedTag,
            ...super.scopedElements
          };

          render() {
            return html\`<div></div>\`;
          }
        }
      `,
      errors: [
        {
          messageId: 'unusedScopedElement',
          data: {
            className: 'MyPage',
            tag: 'unused-tag'
          }
        }
      ]
    },
    {
      code: `
        class MyPage {
          static get scopedElements() {
            return {
              'unused-tag': UnusedTag,
              ...super.scopedElements
            };
          }

          render() {
            return html\`<div></div>\`;
          }
        }
      `,
      errors: [
        {
          messageId: 'unusedScopedElement',
          data: {
            className: 'MyPage',
            tag: 'unused-tag'
          }
        }
      ]
    }
  ]
});
