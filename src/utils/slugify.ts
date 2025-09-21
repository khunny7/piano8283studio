export function slugify(str: string) {
  return str
    .toLowerCase()
    // Preserve Korean characters (Hangul: U+AC00-U+D7AF), alphanumeric, spaces, and hyphens
    .replace(/[^\uAC00-\uD7AFa-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    // Remove any leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}
