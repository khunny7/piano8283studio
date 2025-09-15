import { UserService } from '../services/userService';
import { UserRole, ROLE_PERMISSIONS, Permission } from '../types/user';

// Database-driven admin checking
export const isUserAdmin = async (uid: string | null): Promise<boolean> => {
  if (!uid) return false;
  return await UserService.isAdmin(uid);
};

// Synchronous version for cases where we already have the user profile
export const isUserAdminSync = (userRole: UserRole | null): boolean => {
  return userRole === 'admin';
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