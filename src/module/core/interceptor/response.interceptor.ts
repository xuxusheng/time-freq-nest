import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HealthController } from '../../health/health.controller';

interface Response<T> {
  errCode: number;
  errMsg: string;
  errDetail: string[];
  errDebug: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    // 健康检查模块，无需处理
    if (ctx.getClass() === HealthController) {
      return next.handle();
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((data) => ({
        errCode: 0,
        errMsg: '',
        errDetail: [],
        errDebug: '',
        data: data || {},
      })),
      tap((data) => {
        this.logger.log(
          JSON.stringify({
            reqId: req.header('x-request-id'),
            url: req.originalUrl,
            res: data,
          }),
        );
      }),
    );
  }
}
