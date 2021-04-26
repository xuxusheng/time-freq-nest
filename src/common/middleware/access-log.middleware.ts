import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AccessLogMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      JSON.stringify({
        reqId: req.header('x-request-id'),
        url: req.originalUrl,
        req: req.body,
      }),
    );
    next();
  }
}
