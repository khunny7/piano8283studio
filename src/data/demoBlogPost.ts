// Demo blog post to showcase rich text editor and image capabilities
export const demoBlogPost = {
  id: 'demo-rich-blog-post',
  title: 'Welcome to Our Enhanced Blog! 🚀',
  slug: 'welcome-enhanced-blog',
  content: `
    <h2>Rich Text Editing is Here!</h2>
    
    <p>We're excited to showcase our new <strong>rich text editor</strong> with full support for:</p>
    
    <ul>
      <li><strong>Bold text</strong> and <em>italic text</em></li>
      <li>Multiple heading levels</li>
      <li>Bulleted and numbered lists</li>
      <li>Code blocks and inline <code>code snippets</code></li>
      <li>Links and images</li>
      <li>And much more!</li>
    </ul>
    
    <h3>Code Example</h3>
    <p>Here's a simple React component example:</p>
    
    <pre><code>function BlogPost({ title, content }) {
  return (
    &lt;article&gt;
      &lt;h1&gt;{title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: content }} /&gt;
    &lt;/article&gt;
  );
}</code></pre>
    
    <h3>Blockquotes</h3>
    <blockquote>
      "The best way to predict the future is to create it." - Peter Drucker
    </blockquote>
    
    <h3>Image Support</h3>
    <p>Our blog now supports beautiful images! Here's an example of what's possible:</p>
    
    <p>✨ <strong>Featured images</strong> appear at the top of blog posts</p>
    <p>🖼️ <strong>Inline images</strong> can be embedded anywhere in your content</p>
    <p>📱 <strong>Responsive design</strong> ensures images look great on all devices</p>
    
    <h3>What's Next?</h3>
    <p>We're constantly improving our blogging experience. Some features on our roadmap include:</p>
    
    <ol>
      <li>Image upload and hosting</li>
      <li><strike>Draft saving</strike> ✅ <strong>Now Available!</strong></li>
      <li><strike>Comment system</strike> ✅ <strong>Now Available!</strong></li>
      <li>Social sharing</li>
      <li>Advanced typography options</li>
    </ol>
    
    <p>Stay tuned for more updates! 🎉</p>
  `,
  author: 'Piano8283 Team',
  authorEmail: 'team@piano8283.dev',
  authorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=piano8283',
  published: new Date().toISOString(),
  tags: ['announcement', 'features', 'blog', 'rich-text'],
  isPrivate: false,
  isDraft: false, // This is a published demo post
  featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80'
};