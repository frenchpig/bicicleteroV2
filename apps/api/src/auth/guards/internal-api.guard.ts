import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class InternalApiGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (process.env['SKIP_INTERNAL_API_GUARD'] === 'true') {
      return true;
    }

    const key = process.env['INTERNAL_API_KEY'];
    if (!key) {
      throw new ForbiddenException('Internal API key not configured');
    }

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const header = request.headers['x-internal-api-key'];
    if (header !== key) {
      throw new ForbiddenException('Invalid internal API key');
    }

    return true;
  }
}
