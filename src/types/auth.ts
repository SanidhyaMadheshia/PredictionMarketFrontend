export interface User {
  walletAddress: string;
  role: 'admin' | 'user';
  name?: string;
}

export type Permission = 
  | 'read' 
  | 'write' 
  | 'delete' 
  | 'manage_users' 
  | 'view_analytics' 
  | 'system_settings';