import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as passwordUtil from '../common/password-hash.util';

jest.mock('../common/password-hash.util');

describe('UsersService', () => {
  let service: UsersService;
  const prisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('create persiste usuario con hash', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    (passwordUtil.hashPassword as jest.Mock).mockResolvedValue('hashed');
    const created = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'j@test.com',
      role: 'ADMIN',
      createdAt: new Date(),
    };
    prisma.user.create.mockResolvedValue(created);

    const dto = {
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'j@test.com',
      password: 'secret1',
      role: 'ADMIN' as const,
    };

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: 'j@test.com', password: 'hashed' }),
      }),
    );
  });

  it('create lanza ConflictException si email duplicado', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 2 });
    await expect(
      service.create({
        nombre: 'A',
        apellido: 'B',
        email: 'dup@test.com',
        password: 'secret1',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
