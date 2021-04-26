import { Controller, Get, UseGuards, Request } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './module/auth/auth.service';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
