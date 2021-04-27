import { IsNumber, IsString } from 'class-validator';

export class FindManyUserDto {
  /**
   * 查询条件（用户名等），模糊匹配
   * @example 张三
   */
  @IsString()
  query = '';

  /**
   * 第几页
   * @example 1
   */
  @IsNumber()
  pn = 1;

  /**
   * 每页记录条数
   * @example 10
   */
  @IsNumber()
  ps = 10;
}
