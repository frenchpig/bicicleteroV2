import {
  getTokenFromCookies,
  nestFetch,
  requireSuperAdmin,
} from '@/lib/nest-client';
import type { UpdateUserDto, User } from '@app/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const token = await getTokenFromCookies();
  const guard = await requireSuperAdmin(token);
  if (guard instanceof Response) return guard;

  const { id } = await context.params;
  const body = (await request.json()) as UpdateUserDto;
  const result = await nestFetch<User>(`/users/${id}`, { method: 'PATCH', body, token });
  return Response.json(result.data, { status: result.status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const token = await getTokenFromCookies();
  const guard = await requireSuperAdmin(token);
  if (guard instanceof Response) return guard;

  const { id } = await context.params;
  const result = await nestFetch<User>(`/users/${id}`, { method: 'DELETE', token });
  return Response.json(result.data, { status: result.status });
}
