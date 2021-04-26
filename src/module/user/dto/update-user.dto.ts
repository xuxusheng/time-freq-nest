// import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto';
// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  /**
   * 用户名
   * @example xusheng
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional() // 不传就跳过这个字段，不修改
  name?: string;
}
