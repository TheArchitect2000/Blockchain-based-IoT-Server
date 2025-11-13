import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { SyslogStrategy } from './strategies/syslog.strategy';
import { InternalStrategy } from './strategies/internal.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Syslog from 'syslog-client';
import { LogController } from './log.controller';
import { LogInfoService } from './log-info.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [ConfigModule, UserModule],
  controllers: [LogController],
  providers: [
    {
      provide: SyslogStrategy,
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          'SYSLOG_SERVER_HOST',
          'localhost',
        );
        const port = configService.get<number>('SYSLOG_SERVER_PORT', 514);
        const nodeName = configService.get<string>('NODE_NAME', 'app-node');
        const level = configService.get<number>(
          'SYSLOG_SERVER_LEVEL',
          Syslog.Severity.Debug,
        );

        const client = Syslog.createClient(host, { port });

        return new SyslogStrategy(client, nodeName, level);
      },
      inject: [ConfigService],
    },
    {
      provide: InternalStrategy,
      useFactory: (configService: ConfigService) => {
        const nodeName = configService.get<string>('NODE_NAME', 'app-node');
        const maxSize = configService.get<number>('LOG_MAX_SIZE_MB', 10);

        return new InternalStrategy(nodeName, maxSize);
      },
      inject: [ConfigService],
    },
    {
      provide: LogService,
      useFactory: (
        configService: ConfigService,
        syslogStrategy: SyslogStrategy,
        internalStrategy: InternalStrategy,
      ) => {
        LogService.setDependencies(
          configService,
          syslogStrategy,
          internalStrategy,
        );
        return LogService;
      },
      inject: [ConfigService, SyslogStrategy, InternalStrategy],
    },
    LogInfoService,
  ],
  exports: [LogService],
})
export class LogModule { }
