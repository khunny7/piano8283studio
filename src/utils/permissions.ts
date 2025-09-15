import { UserService } from '../services/userService';
import { UserRole, ROLE_PERMISSIONS, Permission } from '../types/user';

// Bootstrap admin emails - ONLY used when users collection is empty
// Add your email here to become the first admin, then remove it after setup
export const BOOTSTRAP_ADMIN_EMAILS: string[] = [
  // Add your email here to bootstrap the first admin:
  'khunny7@gmail.com'
];

// Database-driven admin checking with bootstrap fallback
export const isUserAdmin = async (uid: string | null): Promise<boolean> => {
  if (!uid) return false;
  return await UserService.isAdmin(uid);
};

// Synchronous version for cases where we already have the user profile
export const isUserAdminSync = (userRole: UserRole | null, userEmail?: string | null): boolean => {
  // Check database role first
  if (userRole === 'admin') return true;
  
  // Bootstrap fallback: if no role is set and email is in bootstrap list
  if (!userRole && userEmail && BOOTSTRAP_ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return true;
  }
  
  return false;
};

export const hasPermission = (userRole: UserRole | null, permission: Permission): boolean => {
  if (!userRole) return false;
  return (ROLE_PERMISSIONS[userRole] as readonly Permission[]).includes(permission);
};

// Get user role by UID
export const getUserRole = async (uid: string | null): Promise<UserRole | null> => {
  if (!uid) return null;
  const userProfile = await UserService.getUserProfile(uid);
  return userProfile?.role || null;
};

// Legacy exports for backward compatibility (now deprecated)
export const ADMIN_EMAILS: string[] = [];

// @deprecated - Use UserService.isAdmin() instead
export const isUserAdminLegacy = (userEmail: string | null): boolean => {
  console.warn('isUserAdminLegacy is deprecated. Use UserService.isAdmin() instead.');
  return false;
};