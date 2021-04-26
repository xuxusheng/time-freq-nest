import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { flattenDepth } from 'lodash';

import { AppModule } from './app.module';
import { BadRequestException, HttpExceptionFilter } from './common/exception';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // 解决常见的 http 安全漏洞问题
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 在 dto 中未定义的字段，将自动被过滤掉
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
