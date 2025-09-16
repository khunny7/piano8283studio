import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';
import { Comment } from '../types';
import { formatDate } from '../utils/formatDate';
import DOMPurify from 'dompurify';

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );
      const snap = await getDocs(q);
      const fetchedComments = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Comment));
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      const sanitizedContent = DOMPurify.sanitize(newComment);
      
      await addDoc(collection(db, 'comments'), {
        postId,
        content: sanitizedContent,
        author: user.displayName || 'Anonymous',
        authorEmail: user.email || '',
        authorPhoto: user.photoURL || '',
        createdAt: serverTimestamp(),
        isModerated: false, // Comments start unmoderated
      });

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!isUserAdminSync(userProfile?.role || null, user?.email)) return;
    
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  if (loading) {
    return (
      <div className="comments-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Comments</h3>
        <p style={{ color: '#666', fontStyle: 'italic' }}>Loading comments...</p>
      </div>
    );
  }

  const userIsAdmin = isUserAdminSync(userProfile?.role || null, user?.email);

  return (
    <div className="comments-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        💬 Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              )}
              <span style={{ fontWeight: 'bold' }}>{user.displayName || 'Anonymous'}</span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                ':focus': {
                  borderColor: '#007bff',
                  outline: 'none'
                }
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={!newComment.trim() || submitting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: submitting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          backgroundColor: '#e9ecef', 
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#495057' }}>
            Please sign in to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                backgroundColor: 'white', 
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {comment.authorPhoto && (
                    <img 
                      src={comment.authorPhoto} 
                      alt={comment.author}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{comment.author}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {comment.createdAt && formatDate(comment.createdAt.toDate().toISOString())}
                    </div>
                  </div>
                </div>
                
                {userIsAdmin && (
                  <button
                    onClick={() => handleDeleteComment(comment.id!)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                    title="Delete comment (admin only)"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <div 
                style={{ fontSize: '0.95rem', lineHeight: '1.5' }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}