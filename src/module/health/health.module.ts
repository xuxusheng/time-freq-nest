import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { SharedModule } from '../shared/shared.module';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';

@Module({
  imports: [TerminusModule, SharedModule],
  providers: [PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
