import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/common/password-hash.util';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = process.env['SEED_PASSWORD'] ?? '123456';

const SEED_USERS = [
  {
    email: process.env['SEED_SUPERADMIN_EMAIL'] ?? 'superadmin@test.com',
    nombre: 'Super',
    apellido: 'Administrador',
    role: Role.SUPERADMIN,
  },
  {
    email: process.env['SEED_ADMIN_EMAIL'] ?? 'admin@test.com',
    nombre: 'Admin',
    apellido: 'Sistema',
    role: Role.ADMIN,
  },
] as const;

async function clearDatabase() {
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.user.deleteMany();
  console.log('Base de datos vaciada.');
}

async function seedUsers(password: string) {
  const hashed = await hashPassword(password);

  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: hashed,
        role: user.role,
      },
      update: {
        nombre: user.nombre,
        apellido: user.apellido,
        password: hashed,
        role: user.role,
      },
    });
    console.log(`${user.role} → ${user.email} (contraseña: ${password})`);
  }
}

async function main() {
  const shouldReset =
    process.env['SEED_RESET'] === 'true' || process.argv.includes('--reset');

  if (shouldReset) {
    await clearDatabase();
  }

  await seedUsers(DEFAULT_PASSWORD);
  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
