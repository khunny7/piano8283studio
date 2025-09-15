import React from 'react';
import { UserDebug } from '../components/UserDebug';
import { FirestoreTest } from '../components/FirestoreTest';

export default function Home() {
  // Check for debug URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const showDebug = urlParams.get('debug') === 'true';

  return (
    <div>
      <h1>Welcome</h1>
      <p>This will become the landing page with hero, featured projects, and latest posts.</p>
      
      {/* Debug components - only show with ?debug=true */}
      {showDebug && (
        <div>
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            color: '#856404'
          }}>
            <strong>🐛 Debug Mode Active</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>
              Debug components are visible. Remove <code>?debug=true</code> from URL to hide.
            </p>
          </div>
          <FirestoreTest />
          <UserDebug />
        </div>
      )}
    </div>
  );
}
