import { getTokenFromCookies, nestFetch } from '@/lib/nest-client';

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const nestPath = `/${path.join('/')}`;
  const url = new URL(request.url);
  const fullPath = url.search ? `${nestPath}${url.search}` : nestPath;
  const token = await getTokenFromCookies();

  let body: unknown;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }
  }

  const result = await nestFetch(fullPath, {
    method: request.method,
    body,
    token,
  });

  return Response.json(result.data, { status: result.status });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
export const PUT = forward;
