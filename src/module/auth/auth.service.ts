import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { UnauthorizedException } from '../core/exception';
import { JwtPayload } from '../shared/interface/jwt.interface';
import { AppConfigService } from '../shared/service/app-config.service';
import { comparePassword } from '../shared/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: AppConfigService,
    private userService: UserService,
  ) {}

  async login(name: string, password: string) {
    const user = await this.userService.findOneByName(name);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload: JwtPayload = {
      id: user.id,
    };

    return sign(payload, this.configService.jwtSecret, {
      expiresIn: 60 * 60, // 单位 s
    });
  }
}
