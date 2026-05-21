import { createUserSchema } from './user.schema';
import { Role } from '@app/types';

describe('user.schema', () => {
  it('rechaza nombre corto', () => {
    const result = createUserSchema.safeParse({
      nombre: 'A',
      apellido: 'Perez',
      email: 'a@test.com',
      password: 'secret1',
      role: Role.ADMIN,
    });
    expect(result.success).toBe(false);
  });

  it('acepta alta válida sin RUN', () => {
    const result = createUserSchema.safeParse({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: 'secret1',
      role: Role.ADMIN,
    });
    expect(result.success).toBe(true);
  });
});
