/**
 * Converts a _spaceless_ string to kebab-case
 * @param {string} str String to convert
 * @return {string}
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z]($|[a-z]))/g, '-$1')
    .replace(/^-/g, '')
    .toLowerCase();
}

/**
 * Converts a _spaceless_ string to snake_case
 * @param {string} str String to convert
 * @return {string}
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z]($|[a-z]))/g, '_$1')
    .replace(/^_/g, '')
    .toLowerCase();
}

/**
 * Converts a _spaceless_ string to PascalCase
 * @param {string} str String to convert
 * @return {string}
 */
export function toPascalCase(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Converts a _spaceless_ string to camelCase
 * @param {string} str String to convert
 * @return {string}
 */
export function toCamelCase(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
}

/**
 * Converts a _spaceless_ string to the specified type of casing
 * @param {string} str String to convert
 * @param {string} type Type of casing
 * @return {string}
 */
export function toCaseByType(
  str: string,
  type: 'kebab' | 'camel' | 'snake' | 'pascal'
): string {
  switch (type) {
    case 'kebab':
      return toKebabCase(str);
    case 'camel':
      return toCamelCase(str);
    case 'snake':
      return toSnakeCase(str);
    case 'pascal':
      return toPascalCase(str);
  }
}
