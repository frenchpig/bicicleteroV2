import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { hashPassword, verifyPassword } from '../common/password-hash.util';

const SELECT_SAFE = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  role: true,
  createdAt: true,
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await verifyPassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    const safeUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: SELECT_SAFE,
    });
    return { access_token: token, user: safeUser };
  }

  async getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: SELECT_SAFE,
    });
  }
}
