import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../common/password-hash.util';

const SELECT_SAFE = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  role: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ select: SELECT_SAFE, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SELECT_SAFE });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await hashPassword(dto.password);
    return this.prisma.user.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: hashed,
        role: dto.role,
      },
      select: SELECT_SAFE,
    });
  }

  async update(id: number, dto: UpdateUserDto, currentUserId: number) {
    const target = await this.findOne(id);

    if (dto.email && dto.email !== target.email) {
      const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email already in use');
    }

    if (target.role === 'SUPERADMIN' && dto.role && dto.role !== 'SUPERADMIN') {
      const superadminCount = await this.prisma.user.count({ where: { role: 'SUPERADMIN' } });
      if (superadminCount <= 1) {
        throw new ForbiddenException('Cannot demote the last SUPERADMIN');
      }
    }

    const data: {
      nombre?: string;
      apellido?: string;
      email?: string;
      role?: UpdateUserDto['role'];
      password?: string;
    } = {};

    if (dto.nombre !== undefined) data.nombre = dto.nombre;
    if (dto.apellido !== undefined) data.apellido = dto.apellido;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.password) data.password = await hashPassword(dto.password);

    return this.prisma.user.update({ where: { id }, data, select: SELECT_SAFE });
  }

  async remove(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    const target = await this.findOne(id);

    if (target.role === 'SUPERADMIN') {
      const superadminCount = await this.prisma.user.count({ where: { role: 'SUPERADMIN' } });
      if (superadminCount <= 1) {
        throw new ForbiddenException('Cannot delete the last SUPERADMIN');
      }
    }

    return this.prisma.user.delete({ where: { id }, select: SELECT_SAFE });
  }
}
