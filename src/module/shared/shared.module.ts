import { Module } from '@nestjs/common';

import { AppConfigService } from './app-config.service';

/**
 * SharedModule，共享模块，用于被多个业务模块导入，提供通用的 Service
 * 注意区分 SharedModule 和 CoreModule
 */
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class SharedModule {}
