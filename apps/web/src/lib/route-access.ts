import { Role } from '@app/types';

const ADMIN_AND_SUPERADMIN_PREFIXES = [
  '/admin/dashboard',
  '/admin/ciclistas',
  '/admin/visitas',
  '/admin/bicicletas',
  '/admin/cupos',
  '/admin/dispositivos',
  '/admin/reportes',
  '/admin/configuracion',
];

const SUPERADMIN_ONLY_PREFIXES = ['/admin/usuarios'];

export function isStaffRole(role: Role | string | undefined): boolean {
  return role === Role.ADMIN || role === Role.SUPERADMIN;
}

export function canAccessPath(pathname: string, role: Role | string | undefined): boolean {
  if (!isStaffRole(role)) return false;

  if (SUPERADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    return role === Role.SUPERADMIN;
  }

  if (pathname.startsWith('/admin')) {
    return (
      ADMIN_AND_SUPERADMIN_PREFIXES.some((p) => pathname.startsWith(p)) ||
      pathname === '/admin'
    );
  }

  return true;
}
