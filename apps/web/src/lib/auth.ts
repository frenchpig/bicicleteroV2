import { Role, User } from '@app/types';

const USER_STORAGE_KEY = 'user';

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setAuth(user: User) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export async function clearAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(USER_STORAGE_KEY);
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore */
  }
}

export function isAdmin(): boolean {
  const role = getUser()?.role;
  return role === Role.ADMIN || role === Role.SUPERADMIN;
}

export function isSuperAdmin(): boolean {
  return getUser()?.role === Role.SUPERADMIN;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type RefreshSessionResult =
  | { status: 'ok'; user: User }
  | { status: 'unauthorized' }
  | { status: 'unavailable' };

/** Reintenta mientras la API arranca (dev: Nest suele levantar después que Next). */
export async function refreshSession(maxAttempts = 10): Promise<RefreshSessionResult> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.status === 401) {
        return { status: 'unauthorized' };
      }
      if (res.ok) {
        const user = (await res.json()) as User;
        setAuth(user);
        return { status: 'ok', user };
      }
      if (res.status === 503 || res.status >= 500) {
        await sleep(400);
        continue;
      }
      return { status: 'unauthorized' };
    } catch {
      await sleep(400);
    }
  }
  return { status: 'unavailable' };
}

/** Limpia cookie httpOnly (vía BFF) y perfil local; no requiere Nest. */
export async function invalidateSession(): Promise<void> {
  await clearAuth();
}
