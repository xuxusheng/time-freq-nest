import { IsNumber } from 'class-validator';

export class FindOneDto {
  /**
   * 主键 ID
   * @example 1
   */
  @IsNumber()
  id: number;
}
