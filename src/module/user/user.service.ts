import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BadRequestException } from '../core/exception';
import { PrismaService } from '../shared/service/prisma.service';
import { catchPrismaNotFoundError, encodePassword } from '../shared/utils';
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
    if (await this.isNameExist(name)) {
      throw new BadRequestException('用户名已被占用');
    }
    const hash = await encodePassword(password);
    return user$.create({ data: { name, password: hash } });
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

  async isNameExist(name: string, excludeId = 0): Promise<boolean> {
    const where: Prisma.UserWhereInput = { name };
    if (!!excludeId) {
      where.id = { not: excludeId };
    }
    const count = await this.prisma.user.count({ where });
    return count !== 0;
  }

  async update(id: number, data: UpdateUserDto) {
    const user$ = this.prisma.user;

    if (data.name && (await this.isNameExist(data.name, id))) {
      throw new BadRequestException('用户名已被占用');
    }

    return user$.update({ where: { id }, data }).catch((err) => {
      catchPrismaNotFoundError(err, '用户不存在');
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } }).catch((err) => {
      catchPrismaNotFoundError(err, '用户不存在');
    });
  }
}
