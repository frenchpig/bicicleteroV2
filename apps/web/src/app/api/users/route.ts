import {
  getTokenFromCookies,
  nestFetch,
  requireSuperAdmin,
} from '@/lib/nest-client';
import type { CreateUserDto, User } from '@app/types';

export async function GET() {
  const token = await getTokenFromCookies();
  const guard = await requireSuperAdmin(token);
  if (guard instanceof Response) return guard;

  const result = await nestFetch<User[]>('/users', { token });
  return Response.json(result.data, { status: result.status });
}

export async function POST(request: Request) {
  const token = await getTokenFromCookies();
  const guard = await requireSuperAdmin(token);
  if (guard instanceof Response) return guard;

  const body = (await request.json()) as CreateUserDto;
  const result = await nestFetch<User>('/users', { method: 'POST', body, token });
  return Response.json(result.data, { status: result.status });
}
