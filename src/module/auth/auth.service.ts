import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UnauthorizedException } from '../../common/exception';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  login(name: string, password: string) {
    const user = this.userService.findOneByName(name);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return this.jwtService.sign({
      sub: user.id,
    });
  }
}
