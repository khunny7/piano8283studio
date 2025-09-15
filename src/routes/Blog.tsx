import React, { useEffect, useState } from 'react';
import { posts } from '../blog';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';

interface LoadedPostMeta {
  slug?: string;
  title?: string;
  summary?: string;
  published?: string;
  tags?: string[];
  default: React.ComponentType<any>;
}

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
  const [loaded, setLoaded] = useState<LoadedPostMeta[]>([]);
  const [active, setActive] = useState<LoadedPostMeta | null>(null);
  const [firestorePosts, setFirestorePosts] = useState<FirestoreBlogPost[]>([]);
  const [selectedFirestorePost, setSelectedFirestorePost] = useState<FirestoreBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load MDX posts
    Promise.all(posts.map(fn => fn())).then(mods => {
      const metas = mods.map(m => m as unknown as LoadedPostMeta);
      setLoaded(metas);
    }).catch(err => {
      console.error('Error loading MDX posts:', err);
    });

    // Load Firestore posts
    fetchFirestorePosts();
  }, [userProfile]); // Re-fetch when user profile changes

  async function fetchFirestorePosts() {
    try {
      setLoading(true);
      setError(null);
      const snap = await getDocs(collection(db, 'blogPosts'));
      const allPosts = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as FirestoreBlogPost));
      
      // Filter out private posts for non-admin users
      const userIsAdmin = isUserAdminSync(userProfile?.role || null);
      const filteredPosts = allPosts.filter(post => 
        !post.isPrivate || (post.isPrivate && userIsAdmin)
      );
      
      // Sort by published date (newest first)
      filteredPosts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      setFirestorePosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching Firestore posts:', err);
      setError('Unable to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Blog</h1>
      
      {/* Firestore Posts Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Latest Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && firestorePosts.length === 0 && (
          <p>No blog posts published yet.</p>
        )}
        
        {!loading && !error && firestorePosts.length > 0 && (
          <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {firestorePosts.map(post => (
                <li key={post.id} style={{ 
                  marginBottom: '1rem', 
                  padding: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  backgroundColor: selectedFirestorePost?.id === post.id ? '#f0f8ff' : 'transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {post.authorPhoto && (
                      <img 
                        src={post.authorPhoto} 
                        alt={post.author}
                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      />
                    )}
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      by {post.author} on {new Date(post.published).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    <button 
                      onClick={() => setSelectedFirestorePost(selectedFirestorePost?.id === post.id ? null : post)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#007bff', 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        padding: 0
                      }}
                    >
                      {post.title}
                    </button>
                  </h3>
                  
                  {post.tags.length > 0 && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      {post.tags.map((tag, index) => (
                        <span 
                          key={`${post.id}-tag-${index}`}
                          style={{ 
                            display: 'inline-block',
                            backgroundColor: '#e9ecef',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            marginRight: '0.5rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </p>
                  
                  {selectedFirestorePost?.id === post.id && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      borderLeft: '4px solid #007bff'
                    }}>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {post.content}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* MDX Posts Section */}
      {loaded.length > 0 && (
        <section>
          <h2>Archive (MDX Posts)</h2>
          <p>Select a post to view inline (temporary simple renderer).</p>
          <ul>
            {loaded.map((mod, index) => (
              <li key={mod.slug || mod.title || `mdx-post-${index}`}>
                <button onClick={() => setActive(mod)} style={{ cursor: 'pointer' }}>
                  {mod.title || mod.slug || `Post ${index + 1}`}
                </button>
              </li>
            ))}
          </ul>
          <hr />
          {active && (
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
              <h2>{active.title}</h2>
              <active.default />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
