import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiRes } from '../shared/decorator/api-res.decorator';
import { Public } from '../shared/decorator/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './entity/login-res.entity';

@Controller('auth')
@ApiTags('auth - 登录注册')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '登录' })
  @ApiRes(LoginRes)
  async login(@Body() loginDto: LoginDto) {
    const { name, password } = loginDto;
    return {
      token: this.authService.login(name, password),
    };
  }
}
