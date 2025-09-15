import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const FirestoreTest: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [status, setStatus] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);

  const testFirestoreConnection = async () => {
    setStatus('Testing Firestore connection...');
    try {
      // Test writing to a test collection
      const testDoc = doc(db, 'test', 'connection');
      await setDoc(testDoc, {
        message: 'Firestore connection successful',
        timestamp: new Date()
      });
      setStatus('✅ Firestore write test successful!');
    } catch (error) {
      setStatus(`❌ Firestore test failed: ${error}`);
      console.error('Firestore test error:', error);
    }
  };

  const testUserCreation = async () => {
    if (!user) {
      setStatus('❌ No user signed in');
      return;
    }

    setStatus('Testing user creation...');
    try {
      const userDoc = doc(db, 'users', user.uid);
      
      // Create a user document
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };

      await setDoc(userDoc, userData);
      setStatus('✅ User document created successfully!');
      
      // Verify it was created
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setStatus('✅ User document verified in Firestore!');
        console.log('Created user document:', docSnap.data());
      } else {
        setStatus('❌ User document not found after creation');
      }
    } catch (error) {
      setStatus(`❌ User creation failed: ${error}`);
      console.error('User creation error:', error);
    }
  };

  const fetchAllUsers = async () => {
    setStatus('Fetching all users...');
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(userList);
      setStatus(`✅ Found ${userList.length} users in database`);
      console.log('All users:', userList);
    } catch (error) {
      setStatus(`❌ Failed to fetch users: ${error}`);
      console.error('Fetch users error:', error);
    }
  };

  const signInTest = async () => {
    try {
      setStatus('Signing in with Google...');
      await signInWithPopup(auth, googleProvider);
      setStatus('✅ Signed in successfully!');
    } catch (error) {
      setStatus(`❌ Sign in failed: ${error}`);
      console.error('Sign in error:', error);
    }
  };

  const signOutTest = async () => {
    try {
      await signOut(auth);
      setStatus('✅ Signed out successfully!');
      setUsers([]);
    } catch (error) {
      setStatus(`❌ Sign out failed: ${error}`);
    }
  };

  return (
    <div style={{ 
      border: '2px solid #ff6b6b', 
      padding: '20px', 
      margin: '20px 0', 
      borderRadius: '8px',
      backgroundColor: '#fff5f5'
    }}>
      <h3>🧪 Firestore Test Panel</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <p><strong>Current User:</strong> {user ? `${user.displayName} (${user.email})` : 'Not signed in'}</p>
        <p><strong>User Profile:</strong> {userProfile ? `Role: ${userProfile.role}` : 'No profile'}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button onClick={testFirestoreConnection} style={{ margin: '4px', padding: '8px' }}>
          Test Firestore Connection
        </button>
        <button onClick={signInTest} style={{ margin: '4px', padding: '8px' }}>
          Sign In with Google
        </button>
        <button onClick={signOutTest} style={{ margin: '4px', padding: '8px' }}>
          Sign Out
        </button>
        <button onClick={testUserCreation} disabled={!user} style={{ margin: '4px', padding: '8px' }}>
          Test User Creation
        </button>
        <button onClick={fetchAllUsers} style={{ margin: '4px', padding: '8px' }}>
          Fetch All Users
        </button>
      </div>

      {users.length > 0 && (
        <div>
          <h4>Users in Database ({users.length}):</h4>
          <ul>
            {users.map((user, index) => (
              <li key={user.id || index} style={{ marginBottom: '8px' }}>
                <strong>{user.displayName || 'No name'}</strong> - {user.email} - Role: {user.role}
                <br />
                <small>Created: {user.createdAt?.toDate?.()?.toLocaleString() || 'Unknown'}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};