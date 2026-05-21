import { nestFetch, setAuthCookie } from '@/lib/nest-client';
import type { AuthResponse } from '@app/types';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await nestFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body,
    token: null,
  });

  if (!result.ok) {
    return Response.json(result.data, { status: result.status });
  }

  await setAuthCookie(result.data.access_token);
  return Response.json({ user: result.data.user });
}
