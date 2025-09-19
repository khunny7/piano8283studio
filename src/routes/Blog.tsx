import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';
import { formatDate } from '../utils/formatDate';
import DOMPurify from 'dompurify';
import { demoBlogPost } from '../data/demoBlogPost';
import { BlogPost } from '../types';
import { Comments } from '../components/Comments';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Blog() {
  const { user, userProfile } = useAuth();
  const [firestorePosts, setFirestorePosts] = useState<BlogPost[]>([]);
  const [selectedFirestorePost, setSelectedFirestorePost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<{[postId: string]: number}>({});
  
  // Admin blog creation state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    slug: '',
    content: '',
    tags: [] as string[],
    isPrivate: false,
    isDraft: true,
    featuredImage: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFirestorePosts();
  }, [userProfile]);

  async function fetchCommentCounts(posts: BlogPost[]) {
    const counts: {[postId: string]: number} = {};
    
    for (const post of posts) {
      try {
        const q = query(collection(db, 'comments'), where('postId', '==', post.id));
        const snap = await getDocs(q);
        counts[post.id!] = snap.size;
      } catch (error) {
        console.error(`Error fetching comment count for post ${post.id}:`, error);
        counts[post.id!] = 0;
      }
    }
    
    setCommentCounts(counts);
  }

  async function fetchFirestorePosts() {
    try {
      setLoading(true);
      setError(null);
      
      // Always include the demo post to showcase functionality
      const allPosts = [demoBlogPost];
      
      try {
        const snap = await getDocs(collection(db, 'blogPosts'));
        const firestorePosts = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as BlogPost));
        allPosts.push(...firestorePosts);
      } catch (firestoreError) {
        console.log('Firestore not available, showing demo content only');
      }
      
      const userIsAdmin = isUserAdminSync(userProfile?.role || null);
      
      // Filter posts: exclude drafts for non-admin users, and exclude private posts for non-admin users
      const filteredPosts = allPosts.filter(post => {
        // Always exclude drafts for public view (only admins can see drafts in admin panel)
        if (post.isDraft) return false;
        
        // For private posts, only show to admins
        if (post.isPrivate && !userIsAdmin) return false;
        
        return true;
      });
      
      filteredPosts.sort((a, b) => {
        const aDate = a.published ? new Date(a.published).getTime() : 0;
        const bDate = b.published ? new Date(b.published).getTime() : 0;
        return bDate - aDate;
      });
      setFirestorePosts(filteredPosts);
      
      // Fetch comment counts for all posts
      fetchCommentCounts(filteredPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Fallback to demo post only
      setFirestorePosts([demoBlogPost]);
    } finally {
      setLoading(false);
    }
  }

  // Get all unique tags
  const allTags = Array.from(new Set(firestorePosts.flatMap(post => post.tags)));
  
  // Filter posts by selected tag
  const filteredPosts = selectedTag === 'all' 
    ? firestorePosts 
    : firestorePosts.filter(post => post.tags.includes(selectedTag));

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    // Strip HTML tags to count words accurately
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getTextExcerpt = (htmlContent: string, maxLength: number = 200) => {
    // Strip HTML tags and get plain text
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? `${textContent.substring(0, maxLength)}...` 
      : textContent;
  };

  const createSafeHtml = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  // Admin blog creation functions
  const userIsAdmin = isUserAdminSync(userProfile?.role || null, user?.email);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setCreateForm(f => ({ 
      ...f, 
      title,
      slug: generateSlug(title)
    }));
  };

  const handleCreatePost = async (isDraftSave = false) => {
    if (!createForm.title || !createForm.slug || !user || saving) return;
    
    try {
      setSaving(true);
      const now = new Date().toISOString();
      const sanitizedContent = DOMPurify.sanitize(createForm.content);
      
      const postData: Partial<BlogPost> = {
        ...createForm,
        content: sanitizedContent,
        author: user.displayName || 'Anonymous',
        authorEmail: user.email || '',
        authorPhoto: user.photoURL || '',
        updatedAt: serverTimestamp(),
        isDraft: isDraftSave,
      };

      if (!isDraftSave) {
        postData.published = now;
      }

      await addDoc(collection(db, 'blogPosts'), {
        ...postData,
        createdAt: serverTimestamp(),
      });
      
      // Reset form and close
      setCreateForm({ 
        title: '', 
        slug: '', 
        content: '', 
        tags: [], 
        isPrivate: false, 
        isDraft: true, 
        featuredImage: '' 
      });
      setShowCreateForm(false);
      
      // Refresh posts
      fetchFirestorePosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image',
    'align', 'blockquote', 'code-block', 'color', 'background'
  ];

  return (
    <div className="blog-page">
      {/* Blog Hero */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-header">
            <div className="header-content">
              <h1>Thoughts & Discoveries</h1>
              <p className="hero-subtitle">
                A collection of ideas, technical insights, and personal reflections 
                from my journey in development and design. Sometimes profound, 
                sometimes just thoughts worth sharing.
              </p>
            </div>
            <div className="header-visual">
              <div className="blog-stats">
                <div className="stat-item">
                  <span className="stat-number">{firestorePosts.length}</span>
                  <span className="stat-label">Articles</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{allTags.length}</span>
                  <span className="stat-label">Topics</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">📚</span>
                  <span className="stat-label">Always Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Controls */}
      {!loading && !error && firestorePosts.length > 0 && (
        <section className="blog-controls">
          <div className="container">
            <div className="controls-wrapper">
              <div className="tag-filters">
                <h3>Filter by topic</h3>
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${selectedTag === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedTag('all')}
                  >
                    <span className="filter-emoji">🌟</span>
                    All Posts
                  </button>
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="blog-info">
                <p className="showing-count">
                  Showing {filteredPosts.length} of {firestorePosts.length} posts
                </p>
                {userIsAdmin && (
                  <button 
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: showCreateForm ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginTop: '8px'
                    }}
                  >
                    {showCreateForm ? '✕ Cancel' : '✏️ Create New Post'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Admin Create Post Form */}
      {userIsAdmin && showCreateForm && (
        <section className="create-post-form" style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
          <div className="container">
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#495057' }}>Create New Blog Post</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Post Title" 
                  value={createForm.title} 
                  onChange={e => handleTitleChange(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="URL Slug (auto-generated)" 
                  value={createForm.slug} 
                  onChange={e => setCreateForm(f => ({ ...f, slug: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Tags (comma-separated)" 
                  value={createForm.tags.join(', ')} 
                  onChange={e => setCreateForm(f => ({ 
                    ...f, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={createForm.isPrivate} 
                    onChange={e => setCreateForm(f => ({ ...f, isPrivate: e.target.checked }))}
                  />
                  <span>Private post</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={createForm.isDraft} 
                    onChange={e => setCreateForm(f => ({ ...f, isDraft: e.target.checked }))}
                  />
                  <span>Save as draft</span>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Featured Image URL (optional)" 
                  value={createForm.featuredImage} 
                  onChange={e => setCreateForm(f => ({ ...f, featuredImage: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
                {createForm.featuredImage && (
                  <div style={{ marginTop: '8px' }}>
                    <img 
                      src={createForm.featuredImage} 
                      alt="Featured image preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                  Content
                </label>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ced4da' }}>
                  <ReactQuill
                    value={createForm.content}
                    onChange={value => setCreateForm(f => ({ ...f, content: value }))}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ minHeight: '200px' }}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleCreatePost(true)}
                  disabled={!createForm.title || !createForm.content || saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: saving ? '#6c757d' : '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: saving || (!createForm.title || !createForm.content) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                
                <button 
                  onClick={() => handleCreatePost(false)}
                  disabled={!createForm.title || !createForm.content || saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: saving ? '#6c757d' : '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: saving || (!createForm.title || !createForm.content) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Publishing...' : 'Publish Post'}
                </button>
                
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateForm({ 
                      title: '', 
                      slug: '', 
                      content: '', 
                      tags: [], 
                      isPrivate: false, 
                      isDraft: true, 
                      featuredImage: '' 
                    });
                  }}
                  disabled={saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: 'transparent', 
                    color: '#6c757d', 
                    border: '1px solid #6c757d', 
                    borderRadius: '4px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Content */}
      <section className="blog-content">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">📚</div>
              <p>Loading articles...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">😕</div>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && firestorePosts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <h3>No articles yet</h3>
              <p>I'm working on some great content. Check back soon!</p>
              {userIsAdmin && (
                <button 
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginTop: '1rem'
                  }}
                >
                  ✏️ Create Your First Post
                </button>
              )}
            </div>
          )}
          
          {!loading && !error && firestorePosts.length > 0 && (
            <>
              {selectedFirestorePost ? (
                // Article view
                <div className="article-view">
                  <button 
                    className="back-button"
                    onClick={() => setSelectedFirestorePost(null)}
                  >
                    ← Back to articles
                  </button>
                  
                  <article className="article">
                    <header className="article-header">
                      {selectedFirestorePost.featuredImage && (
                        <div className="article-featured-image">
                          <img 
                            src={selectedFirestorePost.featuredImage} 
                            alt={selectedFirestorePost.title}
                            style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }}
                          />
                        </div>
                      )}
                      
                      <h1>{selectedFirestorePost.title}</h1>
                      
                      <div className="article-meta">
                        <div className="author-info">
                          {selectedFirestorePost.authorPhoto && (
                            <img 
                              src={selectedFirestorePost.authorPhoto} 
                              alt={selectedFirestorePost.author}
                              className="author-photo"
                            />
                          )}
                          <div className="author-details">
                            <span className="author-name">{selectedFirestorePost.author}</span>
                            <span className="publish-date">
                              {selectedFirestorePost.published ? formatDate(selectedFirestorePost.published) : 'Draft'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="reading-info">
                          <span className="reading-time">
                            {readingTime(selectedFirestorePost.content)} min read
                          </span>
                        </div>
                      </div>
                      
                      {selectedFirestorePost.tags.length > 0 && (
                        <div className="article-tags">
                          {selectedFirestorePost.tags.map((tag, index) => (
                            <span key={index} className="article-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </header>
                    
                    <div className="article-content">
                      <div 
                        dangerouslySetInnerHTML={createSafeHtml(selectedFirestorePost.content)}
                      />
                    </div>
                    
                    {/* Comments Section */}
                    <Comments postId={selectedFirestorePost.id!} />
                  </article>
                </div>
              ) : (
                // Articles list view
                <div className="articles-grid">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="article-card">
                      {post.featuredImage && (
                        <div className="card-featured-image">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="card-content">
                        <header className="card-header">
                          <h2>
                            <button 
                              onClick={() => setSelectedFirestorePost(post)}
                              className="article-title-link"
                            >
                              {post.title}
                            </button>
                          </h2>
                          
                          <div className="card-meta">
                            <div className="author-info">
                              {post.authorPhoto && (
                                <img 
                                  src={post.authorPhoto} 
                                  alt={post.author}
                                  className="author-photo-small"
                                />
                              )}
                              <span className="author-name">{post.author}</span>
                            </div>
                            <span className="publish-date">
                              {post.published ? formatDate(post.published) : 'Draft'}
                            </span>
                          </div>
                        </header>
                        
                        <div className="card-excerpt">
                          <p>
                            {getTextExcerpt(post.content)}
                          </p>
                        </div>
                        
                        <footer className="card-footer">
                          <div className="card-tags">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="card-tag">
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="more-tags">+{post.tags.length - 3}</span>
                            )}
                          </div>
                          
                          <div className="reading-info">
                            <span className="reading-time">
                              {readingTime(post.content)} min read
                            </span>
                            <span className="comment-count" style={{ marginLeft: '1rem' }}>
                              💬 {commentCounts[post.id!] || 0} comments
                            </span>
                          </div>
                        </footer>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Admin Create Post Form - also shown when no posts exist */}
      {userIsAdmin && showCreateForm && firestorePosts.length === 0 && (
        <section className="create-post-form" style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
          <div className="container">
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#495057' }}>Create Your First Blog Post</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Post Title" 
                  value={createForm.title} 
                  onChange={e => handleTitleChange(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="URL Slug (auto-generated)" 
                  value={createForm.slug} 
                  onChange={e => setCreateForm(f => ({ ...f, slug: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Tags (comma-separated)" 
                  value={createForm.tags.join(', ')} 
                  onChange={e => setCreateForm(f => ({ 
                    ...f, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={createForm.isPrivate} 
                    onChange={e => setCreateForm(f => ({ ...f, isPrivate: e.target.checked }))}
                  />
                  <span>Private post</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={createForm.isDraft} 
                    onChange={e => setCreateForm(f => ({ ...f, isDraft: e.target.checked }))}
                  />
                  <span>Save as draft</span>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <input 
                  placeholder="Featured Image URL (optional)" 
                  value={createForm.featuredImage} 
                  onChange={e => setCreateForm(f => ({ ...f, featuredImage: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
                {createForm.featuredImage && (
                  <div style={{ marginTop: '8px' }}>
                    <img 
                      src={createForm.featuredImage} 
                      alt="Featured image preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                  Content
                </label>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ced4da' }}>
                  <ReactQuill
                    value={createForm.content}
                    onChange={value => setCreateForm(f => ({ ...f, content: value }))}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ minHeight: '200px' }}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleCreatePost(true)}
                  disabled={!createForm.title || !createForm.content || saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: saving ? '#6c757d' : '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: saving || (!createForm.title || !createForm.content) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                
                <button 
                  onClick={() => handleCreatePost(false)}
                  disabled={!createForm.title || !createForm.content || saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: saving ? '#6c757d' : '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: saving || (!createForm.title || !createForm.content) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Publishing...' : 'Publish Post'}
                </button>
                
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateForm({ 
                      title: '', 
                      slug: '', 
                      content: '', 
                      tags: [], 
                      isPrivate: false, 
                      isDraft: true, 
                      featuredImage: '' 
                    });
                  }}
                  disabled={saving}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: 'transparent', 
                    color: '#6c757d', 
                    border: '1px solid #6c757d', 
                    borderRadius: '4px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Footer */}
      {!loading && !error && firestorePosts.length > 0 && !selectedFirestorePost && (
        <section className="blog-footer">
          <div className="container">
            <h2>Want to stay updated?</h2>
            <p>
              We write about development, design, and the occasional life lesson. 
              No spam, just genuine thoughts from a team who loves to build things.
            </p>
            <div className="newsletter-note">
              <p>📧 Newsletter coming soon! For now, feel free to bookmark this page.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
