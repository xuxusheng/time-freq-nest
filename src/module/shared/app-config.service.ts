import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get databaseDSN(): string {
    return this.configService.get('DATABASE_DSN');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }
}
