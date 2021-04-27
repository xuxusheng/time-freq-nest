import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';

import { AppConfigService } from '../../shared/app-config.service';
import { IS_PUBLIC_KEY } from '../../shared/decorator/public.decorator';
import { JwtPayload } from '../../shared/interface/jwt.interface';
import { UserService } from '../../user/user.service';
import {
  TokenEmptyException,
  TokenExpiredException,
  TokenInvalidException,
} from '../exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private appConfigService: AppConfigService,
    private userService: UserService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();

    const token = req.header('Authorization').replace(/^Bearer /i, '');

    if (!token) {
      throw new TokenEmptyException();
    }

    let decoded: JwtPayload;

    try {
      decoded = verify(token, this.appConfigService.jwtSecret) as JwtPayload;
    } catch (e) {
      // token 非法
      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      }

      throw new TokenInvalidException();
    }

    // 校验通过
    req.user = await this.userService.findOneById(decoded.id);
    return true;
  }
}
