// Simple admin configuration
// In a real application, this would be stored in a database with proper role management

export const ADMIN_EMAILS: string[] = [
  // Add admin email addresses here
  // Example: 'your-email@gmail.com',
  // To become an admin, add your email address to this array and redeploy the app
];

export const isUserAdmin = (userEmail: string | null): boolean => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

export interface UserRole {
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
}

// Default permissions for different roles
export const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  user: ['read']
};

export const hasPermission = (userEmail: string | null, permission: string): boolean => {
  if (!userEmail) return false;
  
  const isAdmin = isUserAdmin(userEmail);
  if (isAdmin) {
    return ROLE_PERMISSIONS.admin.includes(permission);
  }
  
  return ROLE_PERMISSIONS.user.includes(permission);
};