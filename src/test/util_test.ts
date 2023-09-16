import * as util from '../util';
import {parse} from 'espree';
import {expect} from 'chai';
import * as ESTree from 'estree';
import {Rule} from 'eslint';

const parseExpr = <T extends ESTree.Node = ESTree.Node>(expr: string): T => {
  const parsed = parse(expr, {
    loc: true,
    ecmaVersion: 6,
    sourceType: 'module'
  });
  return (parsed as ESTree.Program).body[0] as T;
};

describe('util', () => {
  let mockContext: Rule.RuleContext;

  beforeEach(() => {
    mockContext = {
      settings: {}
    } as unknown as Rule.RuleContext;
  });

  describe('isCustomElement', () => {
    it('should parse direct sub classes of HTMLElement', () => {
      const doc = parseExpr<ESTree.Class>(`class Foo extends HTMLElement {}`);
      util.isCustomElement(mockContext, doc); // Primes the cache
      expect(util.isCustomElement(mockContext, doc)).to.equal(true);
    });

    it('should parse direct sub classes of custom bases', () => {
      const doc = parseExpr<ESTree.Class>(`class Foo extends MyBase {}`);
      mockContext.settings = {
        wc: {
          elementBaseClasses: ['MyBase']
        }
      };
      expect(util.isCustomElement(mockContext, doc)).to.equal(true);
    });

    it('should parse annotated classes', () => {
      const jsdoc: ESTree.Comment = {
        type: 'Line',
        value: '* @customElement *',
        range: [0, 0],
        loc: {
          start: {line: 0, column: 0},
          end: {line: 0, column: 0}
        }
      };
      const doc = parseExpr<ESTree.Class>(`/** @customElement **/
        class Foo extends Bar {}`);
      expect(util.isCustomElement(mockContext, doc, jsdoc)).to.equal(true);
    });

    it('should be false for normal classes', () => {
      let doc = parseExpr<ESTree.Class>(`class Foo extends Bar {}`);
      expect(util.isCustomElement(mockContext, doc)).to.equal(false);

      doc = parseExpr<ESTree.Class>(`class Foo {}`);
      expect(util.isCustomElement(mockContext, doc)).to.equal(false);
    });
  });

  describe('getElementBaseClasses', () => {
    it('should default to HTMLElement, LitElement', () => {
      expect(util.getElementBaseClasses(mockContext)).to.deep.equal([
        'HTMLElement'
      ]);
    });

    it('should respect user settings', () => {
      const result = util.getElementBaseClasses({
        ...mockContext,
        settings: {
          wc: {
            elementBaseClasses: ['FooElement']
          }
        }
      });
      expect(result).to.deep.equal(['HTMLElement', 'FooElement']);
    });
  });
});
