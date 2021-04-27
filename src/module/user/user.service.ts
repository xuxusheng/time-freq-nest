import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BadRequestException, NotFoundException } from '../core/exception';
import { PrismaService } from '../shared/service/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const { name, password } = data;
    const user$ = this.prisma.user;
    // 判断用户名是否已存在
    if ((await user$.count({ where: { name } })) !== 0) {
      throw new BadRequestException('用户名已被占用');
    }
    return user$.create({ data: { name, password } });
  }

  async listAndCount(query: string, pn: number, ps: number) {
    const user$ = this.prisma.user;
    const where: Prisma.UserWhereInput = { name: { contains: query } };
    const users = await user$.findMany({
      skip: (pn - 1) * ps,
      take: ps,
      where,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    const total = await user$.count({ where });
    return { pn, ps, total, items: users };
  }

  findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prisma.user.findFirst({ where: { name } });
  }

  async update(id: number, data: UpdateUserDto) {
    const user$ = this.prisma.user;

    if (
      data.name &&
      (await user$.count({ where: { name: data.name, id: { not: id } } })) !== 0
    ) {
      throw new BadRequestException('用户名已被占用');
    }
    return user$.update({ where: { id }, data });
  }

  async delete(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025' /* Record to delete does not exist*/
      ) {
        throw new NotFoundException('用户不存在');
      }
      throw e;
    }
  }
}
