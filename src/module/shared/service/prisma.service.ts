import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { encodePassword } from '../utils';
import { AppConfigService } from './app-config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(private appConfigService: AppConfigService) {
    super({
      log: appConfigService.isDev ? ['query', 'info', 'warn', 'error'] : [],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // 创建一个初始账户
    if ((await this.user.count()) === 0) {
      const hash = await encodePassword('admin');
      await this.user.create({
        data: {
          name: 'admin',
          password: hash,
        },
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
