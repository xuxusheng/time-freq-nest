import { flattenDepth } from 'lodash';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { BadRequestException, HttpExceptionFilter } from './common/exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
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
