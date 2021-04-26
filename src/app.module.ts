import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AccessLogMiddleware } from './common/middleware/access-log.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AuthModule } from './module/auth/auth.module';
import { HealthModule } from './module/health/health.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 可以在这里把登录、注册接口的访问日志给取消掉
    consumer
      .apply(RequestIdMiddleware, AccessLogMiddleware)
      .exclude('health/(.*)') // 健康检查模块不用打访问日志
      .forRoutes('*');
  }
}
