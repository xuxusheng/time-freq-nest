import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  BadRequestException as CustomBadRequestException,
  CustomException,
  InternalServerErrorException,
  NotFoundException as CustomNotFoundException,
} from './custom.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: CustomException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let err: CustomException;

    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        // 由框架自带的 Validation 插件，例如 ParseIntPipe 等在参数校验出错时抛出的错误，建议后期全部改成自定义的 pipe，直接抛出自定义错误
        err = new CustomBadRequestException().withDetail([exception.message]);
      } else if (exception instanceof NotFoundException) {
        // 如果是框架自动抛出的错误，比如路由未匹配到 404 等，会走到这里
        err = new CustomNotFoundException().withMsg(exception.message);
      } else {
        err = new InternalServerErrorException().withMsg(exception.message);
      }
    } else if (exception instanceof CustomException) {
      // 抛出的错误为自定义错误类型
      err = exception;
    } else if (exception instanceof Error) {
      // 抛出的错误为 Error 类型
      err = new InternalServerErrorException().withDebug(exception.message);
    } else if (typeof exception === 'string') {
      // 抛出字符串
      this.logger.error('不建议直接 throw 字符串，请修改代码');
      err = new InternalServerErrorException().withDebug(exception);
    } else {
      // 抛出的错误类型有误
      err = new InternalServerErrorException().withDebug(
        '程序抛出的错误类型有误，请联系管理员',
      );
    }

    this.logger.error(
      JSON.stringify({
        reqId: req.header('x-request-id'),
        url: req.originalUrl,
        res: err.toResponse(),
      }),
    );
    res.status(err.statusCode).json(err.toResponse());
  }
}
