import 'server-only';
import { cookies } from 'next/headers';
import { Role } from '@app/types';

const API_URL = process.env.API_URL ?? 'http://localhost:3001/api';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? '';
const COOKIE_NAME = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export type NestFetchOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  retries?: number;
  retryDelayMs?: number;
};

const DEFAULT_RETRIES = 8;
const DEFAULT_RETRY_DELAY_MS = 400;

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  return (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ETIMEDOUT' ||
    error.message.includes('fetch failed')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTokenFromCookies(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function nestFetch<T = unknown>(
  path: string,
  options: NestFetchOptions = {},
): Promise<{ data: T; status: number; ok: boolean }> {
  const maxAttempts = options.retries ?? DEFAULT_RETRIES;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Internal-Api-Key': INTERNAL_API_KEY,
  };

  const token = options.token !== undefined ? options.token : await getTokenFromCookies();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        cache: 'no-store',
      });

      let data: T;
      const text = await res.text();
      try {
        data = text ? (JSON.parse(text) as T) : ({} as T);
      } catch {
        data = { message: text } as T;
      }

      return { data, status: res.status, ok: res.ok };
    } catch (error) {
      lastError = error;
      if (!isConnectionError(error) || attempt === maxAttempts) {
        break;
      }
      await sleep(retryDelayMs);
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'No se pudo conectar con la API';
  return {
    data: { message: 'API no disponible', detail: message } as T,
    status: 503,
    ok: false,
  };
}

export async function proxyNestResponse(path: string, options: NestFetchOptions = {}) {
  const result = await nestFetch(path, options);
  return Response.json(result.data, { status: result.status });
}

export async function requireSuperAdmin(token: string | null): Promise<{ ok: true } | Response> {
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const me = await nestFetch<{ role: Role }>('/auth/me', { token });
  if (!me.ok) {
    return Response.json(me.data, { status: me.status });
  }
  if (me.data.role !== Role.SUPERADMIN) {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }
  return { ok: true };
}
