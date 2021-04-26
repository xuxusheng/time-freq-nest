import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AccessLogMiddleware } from './common/middleware/access-log.middleware';
import { AuthModule } from './module/auth/auth.module';
import { HealthModule } from './module/health/health.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
