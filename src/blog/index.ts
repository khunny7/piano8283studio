// Simple importer for MDX posts (static import list for now)
// In a larger site you might glob import with import.meta.glob.

export const posts = [
  () => import('../content/blog/hello-world.mdx'),
  () => import('../content/blog/building-this-site.mdx')
];
