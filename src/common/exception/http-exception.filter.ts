import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import {
  CustomException,
  InternalServerErrorException,
} from './custom.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let err: CustomException;
    if (exception instanceof CustomException) {
      // 抛出的错误为自定义错误类型
      err = exception;
    } else if (exception instanceof Error) {
      // 抛出的错误为 Error 类型
      err = new InternalServerErrorException().withDebug(exception.message);
    } else if (typeof exception === 'string') {
      // 抛出字符串
      console.warn('不建议直接 throw 字符串，请修改代码');
      err = new InternalServerErrorException().withDebug(exception);
    } else {
      // 抛出的错误类型有误
      console.log(typeof exception);
      err = new InternalServerErrorException().withDebug(
        '程序抛出的错误类型有误，请联系管理员',
      );
    }

    response.status(err.statusCode).json(err.toResponse());
  }
}
