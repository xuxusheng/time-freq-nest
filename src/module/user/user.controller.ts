import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { ApiPageRes, ApiRes } from '../shared/decorator/api-res.decorator';
import { FindOneDto } from '../shared/dto/find-one.dto';
import { User } from '../shared/entitiy';
import { CreateUserDto } from './dto/create-user.dto';
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
  @ApiRes(User, ApiCreatedResponse)
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.userService.create(createUserDto);
  }

  //  --- R ---

  @Get()
  @ApiOperation({ summary: '查询多个用户' })
  @ApiPageRes(User)
  findMany() {
    return this.userService.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个用户' })
  @ApiRes(User)
  findOne(@Param() params: FindOneDto) {
    return this.userService.findOneById(params.id);
  }

  // --- U ---

  @Patch(':id')
  @ApiOperation({
    summary: '修改用户基础信息',
    description: '只能修改除密码等敏感信息之外的基础信息',
  })
  @ApiRes()
  update(@Param() params: FindOneDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(params.id, updateUserDto);
  }

  // --- D ---

  @Delete(':id')
  @ApiOperation({
    summary: '删除单个用户',
  })
  @ApiRes()
  delete(@Param() params: FindOneDto) {
    return this.userService.delete(params.id);
  }
}
