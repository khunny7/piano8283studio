import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isUserAdminSync } from '../../utils/permissions';

export const HeaderAuth: React.FC = () => {
  const { user, userProfile, loading, signInWithGoogle, logout } = useAuth();
  const userIsAdmin = isUserAdminSync(userProfile?.role || null);

  if (loading) {
    return <div style={{ fontSize: '0.9rem', color: '#666' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {user ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
            )}
            <span style={{ fontSize: '0.9rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || user.email}
              {userIsAdmin && <span style={{ color: '#28a745', fontWeight: 'bold', marginLeft: '4px' }}>(Admin)</span>}
            </span>
          </div>
          <button 
            onClick={logout}
            style={{ 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.8rem',
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button 
          onClick={signInWithGoogle}
          style={{ 
            padding: '0.25rem 0.5rem', 
            fontSize: '0.8rem',
            backgroundColor: '#4285f4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      )}
    </div>
  );
};