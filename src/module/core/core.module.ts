import { TracingHttpInterceptor, TracingModule } from '@donews/nestjs-tracing';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { flattenDepth } from 'lodash';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { BadRequestException, HttpExceptionFilter } from './exception';
import { AuthGuard } from './guard/auth.guard';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { AccessLogMiddleware } from './middleware/access-log.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';

/**
 * CoreModule, 核心模块，用于设置全局的 Guard，Pipe、Filter、Interceptor、Middleware 等等
 * CoreModule 应该仅被 AppModule 导入
 * CoreModule 的内容，理论上是可以全部放入 AppModule 中的，所以换个角度讲，CoreModule 可以起到简化 AppModule 代码的作用
 * 注意区分 CoreModule 和 SharedModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // 直接缓存住，因为每次修改环境变量之后，集群会自动重新 deploy
      isGlobal: true,
      // ignoreEnvFile: true, // 生产环境时，忽略 env 文件，使用容器的系统环境变量,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        APP_NAME: Joi.string().default('time-freq-nest'),
        JAEGER_URL: Joi.string().optional(),
        DATABASE_DSN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TracingModule.forRoot({
      tracingConfig: {
        // 使用异步模块，从 AppConfig 中拿有依赖报错的问题，还需要研究下
        serviceName: process.env.APP_NAME || 'time-freq-nest',
        sampler: {
          param: 1,
          type: 'const',
        },
        reporter: {
          collectorEndpoint:
            process.env.JAEGER_URL || 'http://localhost:14268/api/traces',
        },
      },
      tracingOption: {
        tags: {},
      },
    }),
    SharedModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER, // 同上
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD, // 这种方式声明全局的 Guard，相比与 app.use，可以在 Guard 中注入依赖
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingHttpInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // 在 dto 中未定义的字段，将自动被过滤掉，这个一定要打开，防止直接将 body 传给 prisma 的 update 函数时，修改了预期之外的字段
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true, // 设置为 true 后，dto 中的字段会根据声明的 ts 类型自动转换（string 到 number ），例如 FindOneDto 中的 id
        },
        // 将校验库抛出的错误，重新格式化成自定义的错误，便于接口返回错误信息
        exceptionFactory: (errors) => {
          return new BadRequestException().withDetail(
            flattenDepth(
              errors.map(({ constraints }) => Object.values(constraints)),
            ),
          );
        },
      }),
    },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 可以在这里把登录、注册接口的访问日志给取消掉
    consumer
      .apply(RequestIdMiddleware, AccessLogMiddleware)
      .exclude('health/(.*)') // 健康检查模块不用打访问日志
      .forRoutes('*');
  }
}
