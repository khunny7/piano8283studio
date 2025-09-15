import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/userService';
import { UserProfile, UserRole } from '../types/user';
import { isUserAdminSync } from '../utils/permissions';

export const UserManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userIsAdmin = isUserAdminSync(userProfile?.role || null);

  useEffect(() => {
    if (userIsAdmin) {
      fetchUsers();
    }
  }, [userIsAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allUsers = await UserService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      const success = await UserService.updateUserRole(uid, newRole);
      if (success) {
        // Update the local state
        setUsers(users.map(user => 
          user.uid === uid ? { ...user, role: newRole } : user
        ));
      } else {
        setError('Failed to update user role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  if (!userIsAdmin) {
    return (
      <div style={{ border: '1px solid #aaa', padding: 16, borderRadius: 8, marginTop: 24 }}>
        <h3>User Management</h3>
        <p>Access denied. Admin privileges required to manage users.</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #aaa', padding: 16, borderRadius: 8, marginTop: 24 }}>
      <h3>User Management</h3>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: 16 }}>
        Manage user roles and permissions
      </p>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button 
              onClick={fetchUsers}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Refresh Users
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ddd' }}>User</th>
                  <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
                  <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {user.photoURL && (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'User'}
                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold' }}>
                            {user.displayName || 'No Name'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4,
                        backgroundColor: user.role === 'admin' ? '#28a745' : '#6c757d',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {user.uid !== userProfile?.uid && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          {user.role === 'user' && (
                            <button
                              onClick={() => handleRoleChange(user.uid, 'admin')}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Promote to Admin
                            </button>
                          )}
                          {user.role === 'admin' && (
                            <button
                              onClick={() => handleRoleChange(user.uid, 'user')}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Demote to User
                            </button>
                          )}
                        </div>
                      )}
                      {user.uid === userProfile?.uid && (
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                          (You)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', margin: 16 }}>
              No users found
            </p>
          )}
        </div>
      )}
    </div>
  );
};