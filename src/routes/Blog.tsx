import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';
import { formatDate } from '../utils/formatDate';

interface FirestoreBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  authorEmail: string;
  authorPhoto?: string;
  published: string;
  tags: string[];
  isPrivate?: boolean;
}

export default function Blog() {
  const { user, userProfile } = useAuth();
  const [firestorePosts, setFirestorePosts] = useState<FirestoreBlogPost[]>([]);
  const [selectedFirestorePost, setSelectedFirestorePost] = useState<FirestoreBlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFirestorePosts();
  }, [userProfile]);

  async function fetchFirestorePosts() {
    try {
      setLoading(true);
      setError(null);
      const snap = await getDocs(collection(db, 'blogPosts'));
      const allPosts = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as FirestoreBlogPost));
      
      const userIsAdmin = isUserAdminSync(userProfile?.role || null);
      const filteredPosts = allPosts.filter(post => 
        !post.isPrivate || (post.isPrivate && userIsAdmin)
      );
      
      filteredPosts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      setFirestorePosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching Firestore posts:', err);
      setError('Unable to load blog posts. Please try again later.');
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
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

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
                from our journey in development and design. Sometimes profound, 
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
                              {formatDate(selectedFirestorePost.published)}
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
                      {selectedFirestorePost.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                </div>
              ) : (
                // Articles list view
                <div className="articles-grid">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="article-card">
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
                              {formatDate(post.published)}
                            </span>
                          </div>
                        </header>
                        
                        <div className="card-excerpt">
                          <p>
                            {post.content.length > 200 
                              ? `${post.content.substring(0, 200)}...` 
                              : post.content
                            }
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
