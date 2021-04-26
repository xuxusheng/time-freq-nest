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

import { ApiPageRes, ApiRes } from '../../common/decorator/api-res.decorator';
import { FindOneDto } from '../../common/dto/find-one.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entitiy/user.entity';
import { UserService } from './user.service';

@ApiTags('user - 用户')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  // --- C ---

  @Post()
  @ApiOperation({ summary: '新建用户' })
  @ApiRes(User, ApiCreatedResponse)
  create(@Body() createUserDto: CreateUserDto) {
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
    return this.userService.findOne(params.id);
  }

  // --- U ---

  @Patch(':id')
  @ApiOperation({
    summary: '修改用户基础信息',
    description: '只能修改除密码等敏感信息之外的基础信息',
  })
  @ApiRes()
  update(@Param() params: FindOneDto, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
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
