import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const INCLUDE_AUTHOR = {
  author: { select: { id: true, email: true } },
};

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany({
      include: INCLUDE_AUTHOR,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id }, include: INCLUDE_AUTHOR });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(dto: CreatePostDto, authorId: number) {
    return this.prisma.post.create({
      data: { ...dto, authorId },
      include: INCLUDE_AUTHOR,
    });
  }

  async update(id: number, dto: UpdatePostDto, userId: number, userRole: string) {
    const post = await this.findOne(id);
    const isPrivileged = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
    if (post.authorId !== userId && !isPrivileged) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    return this.prisma.post.update({ where: { id }, data: dto, include: INCLUDE_AUTHOR });
  }

  async remove(id: number, userId: number, userRole: string) {
    const post = await this.findOne(id);
    const isPrivileged = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
    if (post.authorId !== userId && !isPrivileged) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.prisma.post.delete({ where: { id }, include: INCLUDE_AUTHOR });
  }
}
