import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /**
   * 用户名
   * @example xusheng
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 密码
   * @example 1234
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}
