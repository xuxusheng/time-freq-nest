import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * 用户名
   * @example xusheng
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 用户密码
   * @example 12345678
   */
  @IsNotEmpty()
  @IsString()
  password: string; // 密码
}
