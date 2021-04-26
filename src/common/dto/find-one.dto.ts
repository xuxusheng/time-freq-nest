import { IsNumberString } from 'class-validator';

export class FindOneDto {
  /**
   * 主键 ID
   * @example 1
   */
  @IsNumberString()
  id: number;
}
