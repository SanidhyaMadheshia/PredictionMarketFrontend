import { Permission, User } from '@/types/auth';

export const rolePermissions: Record<string, Permission[]> = {
  admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_settings'],
  user: ['read', 'write']
};

// const ADMIN_WALLETS = [
//   '0xda06BB25f85edc573D33A8C50D789d29fA23Ff1E',
// ];

export function getUserRoleFromWallet(walletAddress: string, adminAddress : string): 'admin' | 'user' {
  return adminAddress.toLowerCase()===walletAddress.toLowerCase() ? 'admin' : 'user';
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) || false;
}

export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role;
}