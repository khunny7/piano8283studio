import React from 'react';
import { BlogAdmin } from '../components/BlogAdmin';
import { UserManagement } from '../components/UserManagement';
import { FirestoreDemo } from '../components/FirestoreDemo';
import { useAuth } from '../context/AuthContext';
import { isUserAdminSync } from '../utils/permissions';
import { DebugUtils } from '../utils/debug';

export default function Admin() {
  const { user, userProfile } = useAuth();
  const userIsAdmin = isUserAdminSync(userProfile?.role || null, user?.email);
  const isDebugMode = DebugUtils.isDebugMode();

  // Redirect non-admin users
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Admin Area</h1>
        <p>Please sign in to access the admin area.</p>
      </div>
    );
  }

  if (!userIsAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the admin area.</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Signed in as: {user.displayName} ({user.email})
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          {isDebugMode && (
            <span style={{ 
              backgroundColor: '#fff3cd', 
              color: '#856404', 
              padding: '8px 12px', 
              borderRadius: 6, 
              fontSize: '0.9rem',
              border: '1px solid #ffeaa7'
            }}>
              🐛 Debug Mode Active
            </span>
          )}
        </div>
        <p style={{ color: '#666', margin: 0 }}>
          Welcome, {user.displayName}! Manage your site content and users.
        </p>
      </div>

      {/* Admin Components */}
      <BlogAdmin />
      <UserManagement />
      
      {/* Debug Component - only in debug mode */}
      {isDebugMode && <FirestoreDemo />}
    </div>
  );
}