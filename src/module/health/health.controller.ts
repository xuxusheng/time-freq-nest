import { All, Controller } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { Public } from '../shared/decorator/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @All('liveness')
  @Public()
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @All('readiness')
  @Public()
  @HealthCheck()
  readiness() {
    return this.health.check([]);
  }
}
