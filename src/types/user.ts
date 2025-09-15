export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export type UserRole = 'user' | 'admin';

export const DEFAULT_USER_ROLE: UserRole = 'user';

export const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_users', 'view_private_posts'],
  user: ['read']
} as const;

export type Permission = typeof ROLE_PERMISSIONS[UserRole][number];