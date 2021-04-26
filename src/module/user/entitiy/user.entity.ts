import { ApiHideProperty } from '@nestjs/swagger';

export class User {
  /**
   * 用户ID
   * @example 1
   */
  id: number;

  /**
   * 用户名
   * @example xusheng
   */
  name: string;

  @ApiHideProperty()
  password: string;
}
