import * as text from '../../util/text.js';
import {expect} from 'chai';

describe('text utils', () => {
  describe('toKebabCase', () => {
    it('should convert strings to kebab-case', () => {
      expect(text.toKebabCase('foobar')).to.equal('foobar');
      expect(text.toKebabCase('fooBar')).to.equal('foo-bar');
      expect(text.toKebabCase('FooBar')).to.equal('foo-bar');
      expect(text.toKebabCase('AfooBfooC')).to.equal('afoo-bfoo-c');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert strings to snake_case', () => {
      expect(text.toSnakeCase('foobar')).to.equal('foobar');
      expect(text.toSnakeCase('fooBar')).to.equal('foo_bar');
      expect(text.toSnakeCase('FooBar')).to.equal('foo_bar');
      expect(text.toSnakeCase('AfooBfooC')).to.equal('afoo_bfoo_c');
    });
  });

  describe('toPascalCase', () => {
    it('should convert strings to PascalCase', () => {
      expect(text.toPascalCase('foobar')).to.equal('Foobar');
      expect(text.toPascalCase('fooBar')).to.equal('FooBar');
      expect(text.toPascalCase('FooBar')).to.equal('FooBar');
      expect(text.toPascalCase('AfooBfooC')).to.equal('AfooBfooC');
      expect(text.toPascalCase('')).to.equal('');
    });
  });

  describe('toCamelCase', () => {
    it('should convert strings to camelCase', () => {
      expect(text.toCamelCase('foobar')).to.equal('foobar');
      expect(text.toCamelCase('fooBar')).to.equal('fooBar');
      expect(text.toCamelCase('FooBar')).to.equal('fooBar');
      expect(text.toCamelCase('AfooBfooC')).to.equal('afooBfooC');
      expect(text.toCamelCase('')).to.equal('');
    });
  });

  describe('toCaseByType', () => {
    it('should convert to kebab case with type=kebab', () => {
      expect(text.toCaseByType('fooBar', 'kebab')).to.equal('foo-bar');
    });

    it('should convert to camel case with type=camel', () => {
      expect(text.toCaseByType('FooBar', 'camel')).to.equal('fooBar');
    });

    it('should convert to snake case with type=snake', () => {
      expect(text.toCaseByType('fooBar', 'snake')).to.equal('foo_bar');
    });

    it('should convert to pascal case with type=pascal', () => {
      expect(text.toCaseByType('fooBar', 'pascal')).to.equal('FooBar');
    });
  });
});
