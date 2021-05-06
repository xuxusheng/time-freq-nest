import {
  All,
  Controller,
  HttpCode,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { Public } from '../shared/decorator/public.decorator';
import { PrismaHealthIndicator } from './prisma.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @All('liveness')
  @Public()
  @HealthCheck()
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMetadata('ExceptJaegerInterceptor', true)
  liveness() {
    return; // body 留空，省流量
  }

  @All('readiness')
  @Public()
  @HealthCheck()
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMetadata('ExceptJaegerInterceptor', true)
  async readiness() {
    await this.prismaHealthIndicator.pingCheck('prisma'); // 多了一个数据库检查，比 liveness 接口要慢了一点，本地测试大概慢了 4ms
    return; // body 留空，省流量
  }
}
