import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from '../../shared/decorator/public.decorator';
import { JwtPayload } from '../../shared/interface/jwt.interface';
import { AppConfigService } from '../../shared/service/app-config.service';
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

    const token = req.header('Authorization')?.replace(/^Bearer /i, '');

    if (!token) {
      throw new TokenEmptyException();
    }

    let decoded: JwtPayload;

    try {
      decoded = verify(token, this.appConfigService.jwtSecret) as JwtPayload;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        // token 过期
        throw new TokenExpiredException();
      }
      // 其他 Token 错误
      throw new TokenInvalidException();
    }

    // 校验通过
    // 如果考虑性能的话，从 token 里获取用户 id 后，不到数据库查或者到 redis 里查
    const user = await this.userService.findOneById(decoded.id);
    if (!user) {
      throw new TokenInvalidException('您的账号已被删除，请重新登录');
    }
    req.user = user;
    return true;
  }
}
