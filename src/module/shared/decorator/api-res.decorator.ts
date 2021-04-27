import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class DWithP<T> {
  @ApiProperty({
    example: 1,
    description: '第几页',
  })
  pn: number;

  @ApiProperty({
    example: 10,
    description: '每页多少条记录',
  })
  ps: number;

  @ApiProperty({
    example: 999,
    description: '总共多少条记录',
  })
  total: number;

  @ApiProperty({
    description: '当前页数据',
  })
  items: T[];
}

export class Resp<T> {
  @ApiProperty({
    example: 0,
    description: '错误码',
  })
  errCode: number;

  @ApiProperty({
    example: '',
    description: '错误信息',
  })
  errMsg: string;

  @ApiProperty({
    example: [],
    description: '错误详情',
  })
  errDetail: string[];

  @ApiProperty({
    example: '',
    description: '错误调试信息',
  })
  errDebug: string;

  @ApiProperty({
    description: '数据',
  })
  data: T;
}

export const ApiPageRes = <T extends Type<any>>(data: T) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Resp) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(DWithP) },
                  {
                    properties: {
                      items: {
                        $ref: getSchemaPath(data),
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiRes = <T extends Type<any>>(
  data?: T,
  decoratorFunc = ApiOkResponse,
) => {
  return applyDecorators(
    decoratorFunc({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Resp) },
          {
            properties: {
              data: data
                ? {
                    $ref: getSchemaPath(data),
                  }
                : {},
            },
          },
        ],
      },
    }),
  );
};
