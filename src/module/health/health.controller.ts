import { All, Controller } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @All('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @All('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([]);
  }
}
