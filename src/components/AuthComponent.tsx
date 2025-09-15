import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthComponent: React.FC = () => {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Authentication</h3>
      {user ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            )}
            <div>
              <div><strong>{user.displayName}</strong></div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{user.email}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p>Please sign in to manage blog posts:</p>
          <button 
            onClick={signInWithGoogle}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4285f4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};