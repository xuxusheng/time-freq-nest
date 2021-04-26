import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { flattenDepth } from 'lodash';

import { AppModule } from './app.module';
import { DWithP, Resp } from './common/decorator/api-res.decorator';
import { BadRequestException, HttpExceptionFilter } from './common/exception';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoginRes } from './module/auth/entity/login-res.entity';
import { User } from './module/user/entitiy/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger 接口文档
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('时频培训平台')
    .setDescription('时频培训平台接口文档，遵循 Restful 规范')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [DWithP, Resp, LoginRes, User],
  });
  SwaggerModule.setup('swagger', app, document);

  // 解决常见的 http 安全漏洞问题
  app.use(helmet());

  // response 拦截器，包装一下正常返回的数据
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 捕获异常并处理
  app.useGlobalFilters(new HttpExceptionFilter());

  // 接口输入参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      // 在 dto 中未定义的字段，将自动被过滤掉
      whitelist: true,
      // 将校验库抛出的错误，重新格式化成自定义的错误，便于接口返回错误信息
      exceptionFactory: (errors) => {
        return new BadRequestException().withDetail(
          flattenDepth(
            errors.map(({ constraints }) => Object.values(constraints)),
          ),
        );
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
