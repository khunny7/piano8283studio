import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/userService';
import { UserProfile } from '../types/user';

export const UserDebug: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching all users...');
      const users = await UserService.getAllUsers();
      console.log('Fetched users:', users);
      setAllUsers(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testCreateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Testing profile creation for user:', user);
      const profile = await UserService.createOrUpdateUserProfile(user);
      console.log('Created/updated profile:', profile);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ 
      border: '2px solid #007acc', 
      padding: '16px', 
      margin: '16px 0', 
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🔍 User Debug Panel</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Current Auth State:</h4>
        <p><strong>User:</strong> {user ? `${user.displayName} (${user.email})` : 'Not signed in'}</p>
        <p><strong>User Profile:</strong> {userProfile ? `Role: ${userProfile.role}` : 'No profile loaded'}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={fetchUsers} 
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            marginRight: '8px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Users'}
        </button>
        
        {user && (
          <button 
            onClick={testCreateProfile} 
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Test Create Profile'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '8px', 
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h4>All Users in Database ({allUsers.length}):</h4>
        {allUsers.length === 0 ? (
          <p style={{ color: '#666' }}>No users found in the database.</p>
        ) : (
          <ul style={{ marginTop: '8px' }}>
            {allUsers.map((user) => (
              <li key={user.uid} style={{ marginBottom: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>{user.displayName || 'No name'}</strong> ({user.email}) - Role: <em>{user.role}</em>
                <br />
                <small>Created: {
                  user.createdAt instanceof Date 
                    ? user.createdAt.toLocaleString() 
                    : (user.createdAt as any)?.toDate?.()?.toLocaleString() || 'Unknown'
                }</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};