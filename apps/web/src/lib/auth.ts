import { User } from '@app/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(token: string, user: User) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAuth() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  document.cookie = 'access_token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  return getUser()?.role === 'ADMIN';
}

export function isSuperAdmin(): boolean {
  return getUser()?.role === 'SUPERADMIN';
}
