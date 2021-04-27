import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let uid = req.header('x-request-id');
    if (!uid) {
      req.headers['x-request-id'] = uid = v4();
    }
    res.setHeader('x-request-id', uid);
    next();
  }
}
