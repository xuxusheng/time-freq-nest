import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { LoginRes } from './module/auth/entity/login-res.entity';
import { DWithP, Resp } from './module/shared/decorator/api-res.decorator';
import { User } from './module/shared/entitiy';

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

  await app.listen(3000);
}

bootstrap();
