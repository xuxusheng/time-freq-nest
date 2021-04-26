import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { TokenExpiredException, TokenInvalidException } from '../exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      throw err;
    } else if (info instanceof TokenExpiredError) {
      throw new TokenExpiredException();
    } else if (info instanceof JsonWebTokenError || !user) {
      throw new TokenInvalidException();
    }
    return user;
  }
}
