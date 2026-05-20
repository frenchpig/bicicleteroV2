import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashed,
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created: admin@test.com / admin123');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
