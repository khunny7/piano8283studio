import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  authorEmail: string;
  authorPhoto?: string;
  published: string;
  createdAt?: any;
  updatedAt?: any;
  tags: string[];
  isPrivate: boolean;
  featuredImage?: string;
}

export function BlogAdmin() {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Omit<BlogPost, 'author' | 'authorEmail' | 'authorPhoto' | 'published' | 'createdAt' | 'updatedAt'>>({
    title: '', 
    slug: '', 
    content: '', 
    tags: [],
    isPrivate: false,
    featuredImage: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchPosts() {
    const snap = await getDocs(collection(db, 'blogPosts'));
    setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleSave() {
    if (!form.title || !form.slug || !user) return;
    
    const now = new Date().toISOString();
    // Sanitize HTML content before saving
    const sanitizedContent = DOMPurify.sanitize(form.content);
    
    const postData = {
      ...form,
      content: sanitizedContent,
      author: user.displayName || 'Anonymous',
      authorEmail: user.email || '',
      authorPhoto: user.photoURL || '',
      published: now,
      updatedAt: serverTimestamp(),
    };

    if (editingId) {
      await updateDoc(doc(db, 'blogPosts', editingId), postData);
    } else {
      await addDoc(collection(db, 'blogPosts'), {
        ...postData,
        createdAt: serverTimestamp(),
      });
    }
    
    setForm({ title: '', slug: '', content: '', tags: [], isPrivate: false, featuredImage: '' });
    setEditingId(null);
    fetchPosts();
  }

  async function handleEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      tags: post.tags,
      isPrivate: post.isPrivate || false,
      featuredImage: post.featuredImage || ''
    });
    setEditingId(post.id || null);
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, 'blogPosts', id));
    fetchPosts();
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm(f => ({ 
      ...f, 
      title,
      slug: generateSlug(title)
    }));
  };

  const userIsAdmin = isUserAdminSync(userProfile?.role || null, user?.email);

  // Quill editor configuration
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

  if (!user) {
    return (
      <div style={{ border: '1px solid #aaa', padding: 16, borderRadius: 8, marginTop: 24 }}>
        <h3>Blog Admin</h3>
        <p>Please sign in to manage blog posts.</p>
      </div>
    );
  }

  if (!userIsAdmin) {
    return (
      <div style={{ border: '1px solid #aaa', padding: 16, borderRadius: 8, marginTop: 24 }}>
        <h3>Blog Admin</h3>
        <p>Access denied. Admin privileges required to manage blog posts.</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #aaa', padding: 16, borderRadius: 8, marginTop: 24 }}>
      <h3>Blog Admin</h3>
      <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
        <p><strong>Logged in as:</strong> {user.displayName} ({user.email})</p>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <input 
            placeholder="Title" 
            value={form.title} 
            onChange={e => handleTitleChange(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <input 
            placeholder="Slug (auto-generated)" 
            value={form.slug} 
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <input 
            placeholder="Tags (comma-separated)" 
            value={form.tags.join(', ')} 
            onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={form.isPrivate} 
              onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
            />
            <span>Private post (only visible to admins)</span>
          </label>
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <input 
            placeholder="Featured Image URL (optional)" 
            value={form.featuredImage} 
            onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
          {form.featuredImage && (
            <div style={{ marginBottom: 8 }}>
              <img 
                src={form.featuredImage} 
                alt="Featured image preview" 
                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: 4 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Content</label>
          <div style={{ backgroundColor: 'white', borderRadius: 4, border: '1px solid #ddd' }}>
            <ReactQuill
              value={form.content}
              onChange={value => setForm(f => ({ ...f, content: value }))}
              modules={quillModules}
              formats={quillFormats}
              style={{ minHeight: '200px' }}
              placeholder="Write your blog post content here..."
            />
          </div>
        </div>
        
        <div>
          <button 
            onClick={handleSave}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              marginRight: 8,
              cursor: 'pointer'
            }}
          >
            {editingId ? 'Update' : 'Publish'} Post
          </button>
          
          {editingId && (
            <button 
              onClick={() => { 
                setForm({ title: '', slug: '', content: '', tags: [], isPrivate: false, featuredImage: '' }); 
                setEditingId(null); 
              }}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <h4>Published Posts</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(post => (
          <li key={post.id} style={{ 
            marginBottom: 16, 
            padding: 12, 
            border: '1px solid #ddd', 
            borderRadius: 4,
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: '1.1em' }}>{post.title}</strong>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Slug: {post.slug} | Tags: {post.tags.join(', ') || 'None'}
                {post.featuredImage && <span> | Has featured image</span>}
              </div>
            </div>
            
            {post.featuredImage && (
              <div style={{ marginBottom: 8 }}>
                <img 
                  src={post.featuredImage} 
                  alt={`Featured image for ${post.title}`}
                  style={{ maxWidth: 150, maxHeight: 100, objectFit: 'cover', borderRadius: 4 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {post.authorPhoto && (
                <img 
                  src={post.authorPhoto} 
                  alt={post.author}
                  style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
              )}
              <span style={{ fontSize: '0.9em', color: '#666' }}>
                by {post.author} on {new Date(post.published).toLocaleDateString()}
              </span>
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.9em', color: '#666', maxHeight: 60, overflow: 'hidden' }}>
                {post.content.substring(0, 100)}...
              </div>
            </div>
            
            <div>
              <button 
                onClick={() => handleEdit(post)}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  marginRight: 8,
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(post.id!)}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
