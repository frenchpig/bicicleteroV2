import { clearAuthCookie } from '@/lib/nest-client';

export async function POST() {
  await clearAuthCookie();
  return Response.json({ ok: true });
}
