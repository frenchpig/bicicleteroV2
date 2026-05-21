import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as passwordUtil from '../common/password-hash.util';

jest.mock('../common/password-hash.util');

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
  };
  const jwtService = { sign: jest.fn().mockReturnValue('token') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('login devuelve token y usuario sin password', async () => {
    const dbUser = {
      id: 1,
      email: 'a@test.com',
      password: 'hash',
      role: 'ADMIN',
      nombre: 'Ana',
      apellido: 'Lopez',
    };
    const safeUser = {
      id: 1,
      nombre: 'Ana',
      apellido: 'Lopez',
      email: 'a@test.com',
      role: 'ADMIN',
      createdAt: new Date(),
    };
    prisma.user.findUnique
      .mockResolvedValueOnce(dbUser)
      .mockResolvedValueOnce(safeUser);
    (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);

    const result = await service.login({ email: 'a@test.com', password: 'secret' });
    expect(result.access_token).toBe('token');
    expect(result.user).toMatchObject({ email: 'a@test.com', nombre: 'Ana' });
  });

  it('login lanza UnauthorizedException si credenciales inválidas', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'x@test.com', password: 'bad' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
