import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get appName(): string {
    return this.configService.get('APP_NAME');
  }

  get jaegerUrl(): string {
    return this.configService.get('JAEGER_URL');
  }

  get databaseDSN(): string {
    return this.configService.get('DATABASE_DSN');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }
}
