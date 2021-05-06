import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { NotFoundException } from '../core/exception';
import { ApiPageRes, ApiRes } from '../shared/decorator/api-res.decorator';
import { FindOneDto } from '../shared/dto/find-one.dto';
import { UserSwagger } from '../shared/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FindManyUserDto } from './dto/find-many-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiBearerAuth()
@ApiTags('user - 用户')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  // --- C ---

  @Post()
  @ApiOperation({ summary: '新建用户' })
  @ApiRes(UserSwagger, ApiCreatedResponse)
  async create(@Body() data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userService.create(data);
    delete user.password;
    return user;
  }

  //  --- R ---

  @Get()
  @ApiOperation({ summary: '查询多个用户' })
  @ApiPageRes(UserSwagger)
  listAndCount(@Body() data: FindManyUserDto) {
    const { query, pn, ps } = data;
    return this.userService.listAndCount(query, pn, ps);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个用户' })
  @ApiRes(UserSwagger)
  async findOne(@Param() params: FindOneDto) {
    const user = await this.userService.findOneById(params.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  // --- U ---

  @Patch(':id')
  @ApiOperation({
    summary: '修改用户基础信息',
    description: '只能修改除密码等敏感信息之外的基础信息',
  })
  @ApiRes()
  async update(@Param() params: FindOneDto, @Body() data: UpdateUserDto) {
    await this.userService.update(params.id, data);
  }

  // --- D ---

  @Delete(':id')
  @ApiOperation({
    summary: '删除单个用户',
  })
  @ApiRes()
  async delete(@Param() params: FindOneDto) {
    await this.userService.delete(params.id);
    return;
  }
}
