import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

import { ServiceUnavailableException } from '../core/exception';
import { PrismaService } from '../shared/service/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw(`SELECT 1`);
      return this.getStatus(key, true);
    } catch (err) {
      throw new ServiceUnavailableException('数据库访问失败').withDebug(
        err.message,
      );
    }
  }
}
