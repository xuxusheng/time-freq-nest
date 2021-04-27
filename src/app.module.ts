import { Module } from '@nestjs/common';

import { AuthModule } from './module/auth/auth.module';
import { CoreModule } from './module/core/core.module';
import { HealthModule } from './module/health/health.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [CoreModule, HealthModule, AuthModule, UserModule],
})
export class AppModule {}
