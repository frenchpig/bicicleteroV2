import { Role } from '@app/types';
import { canAccessPath, isStaffRole } from './route-access';

describe('route-access', () => {
  it('ADMIN accede a dashboard', () => {
    expect(canAccessPath('/admin/dashboard', Role.ADMIN)).toBe(true);
  });

  it('ADMIN no accede a usuarios', () => {
    expect(canAccessPath('/admin/usuarios', Role.ADMIN)).toBe(false);
  });

  it('SUPERADMIN accede a usuarios', () => {
    expect(canAccessPath('/admin/usuarios', Role.SUPERADMIN)).toBe(true);
  });

  it('isStaffRole rechaza roles desconocidos', () => {
    expect(isStaffRole('USER')).toBe(false);
    expect(isStaffRole(Role.ADMIN)).toBe(true);
  });
});
