import { Injectable } from '@nestjs/common';
import { LoggingStrategyInterface } from './logging-strategy.interface';
import * as Syslog from 'syslog-client';

@Injectable()
export class SyslogStrategy implements LoggingStrategyInterface {
  /**
   *
   */
  constructor(
    private client: Syslog.Client,
    private readonly nodeName: string,
    private readonly level: number,
  ) {}

  log(message: string, userId?: string): void {
    if (userId) {
      message += `,${userId},${this.nodeName}`;
    } else {
      message += `,${this.nodeName}`;
    }
    this.client.log(
      message,
      {
        facility: Syslog.Facility.Local0,
        severity: this.level,
      },
      (err) => {
        if (err) console.error('Syslog send error:', err);
      },
    );
  }
}
