import { Module } from '@nestjs/common';
import { SyslogService } from './syslog.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SyslogService],
  exports: [SyslogService],
})
export class SyslogModule {}
