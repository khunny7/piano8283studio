import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost as BlogPostType } from '../types';
import { formatDate } from '../utils/formatDate';
import { Comments } from '../components/Comments';
import DOMPurify from 'dompurify';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'blogPosts'),
          where('slug', '==', decodeURIComponent(slug))
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        const postData = snapshot.docs[0].data() as BlogPostType;
        const postWithId = { ...postData, id: snapshot.docs[0].id };
        
        // Check if post is published or is a draft (drafts should not be publicly accessible)
        if (postWithId.isDraft) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        setPost(postWithId);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  const createSafeHtml = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Post Not Found</h2>
        <p>{error || 'The blog post you are looking for does not exist.'}</p>
        <Link 
          to="/blog" 
          style={{ 
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/blog"
          style={{ 
            color: '#007bff', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Post Header */}
      <article>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            {post.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {post.authorPhoto && (
              <img 
                src={post.authorPhoto} 
                alt={post.author}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: '500', color: '#333' }}>{post.author}</div>
              <div>
                {post.published ? formatDate(post.published) : 'Draft'}
                {post.tags.length > 0 && (
                  <span> • {post.tags.join(', ')}</span>
                )}
              </div>
            </div>
          </div>

          {post.featuredImage && (
            <div style={{ marginBottom: '2rem' }}>
              <img 
                src={post.featuredImage}
                alt={post.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </header>

        {/* Post Content */}
        <div 
          style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.7',
            marginBottom: '3rem'
          }}
          dangerouslySetInnerHTML={createSafeHtml(post.content)}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div style={{ 
            marginBottom: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid #eee'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Tags:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    border: '1px solid #dee2e6'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      {post.id && (
        <div style={{ 
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '2px solid #eee'
        }}>
          <Comments postId={post.id} />
        </div>
      )}
    </div>
  );
}