import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { UserProfile, UserRole, DEFAULT_USER_ROLE } from '../types/user';
import { DebugUtils } from '../utils/debug';

export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  // Create or update user profile on sign-in
  static async createOrUpdateUserProfile(user: User): Promise<UserProfile> {
    DebugUtils.log('createOrUpdateUserProfile called for user:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });

    const userRef = doc(db, this.COLLECTION_NAME, user.uid);
    const userSnap = await getDoc(userRef);

    const now = new Date();
    
    if (userSnap.exists()) {
      DebugUtils.log('User exists, updating profile...');
      // Update existing user's last login
      const userData = userSnap.data() as UserProfile;
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Update profile info in case it changed
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
      
      DebugUtils.log('Updated existing user profile');
      return {
        ...userData,
        lastLoginAt: now,
        updatedAt: now,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email || userData.email
      };
    } else {
      DebugUtils.log('Creating new user profile...');
      // Create new user profile with default role
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: DEFAULT_USER_ROLE,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now
      };

      DebugUtils.log('Saving new user profile to Firestore...', newUserProfile);
      await setDoc(userRef, {
        ...newUserProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });

      DebugUtils.log('Created new user profile successfully');
      return newUserProfile;
    }
  }

  // Get user profile by UID
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user role (admin only operation)
  static async updateUserRole(uid: string, newRole: UserRole): Promise<boolean> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      DebugUtils.log('Getting all users from Firestore...');
      const usersQuery = query(collection(db, this.COLLECTION_NAME));
      const querySnapshot = await getDocs(usersQuery);
      
      DebugUtils.log('Query returned', querySnapshot.docs.length, 'documents');
      
      const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        DebugUtils.log('User document:', doc.id, data);
        return {
          uid: doc.id,
          ...data
        } as UserProfile;
      });
      
      DebugUtils.log('Processed users:', users);
      return users;
    } catch (error) {
      DebugUtils.logError('Error fetching users:', error);
      return [];
    }
  }

  // Check if user has specific role
  static async hasRole(uid: string, role: UserRole): Promise<boolean> {
    const userProfile = await this.getUserProfile(uid);
    return userProfile?.role === role || false;
  }

  // Check if user is admin (with bootstrap fallback)
  static async isAdmin(uid: string): Promise<boolean> {
    const userProfile = await this.getUserProfile(uid);
    
    // First check database role
    if (userProfile?.role === 'admin') {
      return true;
    }
    
    // Bootstrap fallback: if no role is set and email is in bootstrap list
    if (!userProfile?.role && userProfile?.email) {
      const { BOOTSTRAP_ADMIN_EMAILS } = await import('../utils/permissions');
      return BOOTSTRAP_ADMIN_EMAILS.includes(userProfile.email.toLowerCase());
    }
    
    return false;
  }
}