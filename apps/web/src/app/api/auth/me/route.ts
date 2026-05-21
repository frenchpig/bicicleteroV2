import { getTokenFromCookies, nestFetch } from '@/lib/nest-client';
import type { User } from '@app/types';

export async function GET() {
  const token = await getTokenFromCookies();
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const result = await nestFetch<User>('/auth/me', { token });
  return Response.json(result.data, { status: result.status });
}
