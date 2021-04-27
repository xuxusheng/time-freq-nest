import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { UnauthorizedException } from '../core/exception';
import { AppConfigService } from '../shared/app-config.service';
import { JwtPayload } from '../shared/interface/jwt.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: AppConfigService,
    private userService: UserService,
  ) {}

  login(name: string, password: string) {
    const user = this.userService.findOneByName(name);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload: JwtPayload = {
      id: user.id,
    };

    return sign(payload, this.configService.jwtSecret);
  }
}
