import { ConfigService } from '@nestjs/config';
import { SyslogStrategy } from './strategies/syslog.strategy';
import { InternalStrategy } from './strategies/internal.strategy';
import { GetInternalLogDto } from './dto/get-internal-log.dto';

export class LogService {
  private static configService: ConfigService;
  private static syslogStrategy: SyslogStrategy;
  private static internalStrategy: InternalStrategy;

  static setDependencies(
    config: ConfigService,
    syslog: SyslogStrategy,
    internal: InternalStrategy,
  ): void {
    LogService.configService = config;
    LogService.syslogStrategy = syslog;
    LogService.internalStrategy = internal;
  }

  static log(message: string, userId?: string): void {
    if (
      LogService.configService.get<string>('SYSLOG_SERVER_ENABLED') === 'True'
    ) {
      LogService.syslogStrategy.log(message, userId);
    }

    if (
      LogService.configService.get<string>('INTERNAL_LOGGING_ENABLED') ===
      'True'
    ) {
      LogService.internalStrategy.log(message, userId);
    }
  }
}
