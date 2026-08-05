/**
 * Map legacy SPA paths (/books/...) to Astro library routes.
 */
export function toAstroPath(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path
    .replace(/^\/books\/square-mile\/companion(\/.*)?$/, '/library/map')
    .replace(/^\/books\/square-mile\/checkout\/([^/]+)/, '/library/checkout/$1')
    .replace(/^\/books\/square-mile\/?$/, '/library/veil')
    .replace(/^\/books\/?$/, '/library')
    .replace(/^\/presale\/executive/, '/library/founders')
    .replace(/^\/presale/, '/library/founders');
}
