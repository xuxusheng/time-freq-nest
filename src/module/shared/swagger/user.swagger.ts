import { ApiHideProperty } from '@nestjs/swagger';

export class UserSwagger {
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

  /**
   * 更新时间
   * @example 2021-04-27T11:29:38.097Z
   */
  createdAt: string;

  /**
   * 创建时间
   * @example 2021-04-27T11:29:38.097Z
   */
  updatedAt: string;
}
