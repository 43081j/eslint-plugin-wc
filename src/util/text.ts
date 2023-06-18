/**
 * Converts a string to kebab-case
 * @param {string} str String to convert
 * @return {string}
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z]($|[a-z]))/g, '-$1')
    .replace(/^-/g, '')
    .toLowerCase();
}
