import { Injectable } from '@nestjs/common';
import * as Syslog from 'syslog-client';

@Injectable()
export class SyslogService {
  private client: Syslog.Client | null = null;
  private enabled = false;
  private username: string;
  private password: string;

  constructor() {
    this.enabled = process.env.SYSLOG_SERVER_ENABLED === 'True';
    this.username = process.env.SYSLOG_SERVER_USERNAME || '';
    this.password = process.env.SYSLOG_SERVER_PASSWORD || '';

    if (this.enabled) {
      this.client = Syslog.createClient(process.env.SYSLOG_SERVER_HOST, {
        port: Number(process.env.SYSLOG_SERVER_PORT || 514),
        transport: Syslog.Transport.Udp,
        // auth: {
        //   username: this.username,
        //   password: this.password,
        // },
      });
    }
  }

  log(message: string) {
    if (!this.client || !this.enabled) return;

    const messageWithUser =
      this.username && this.password
        ? `[${this.username}] ${message}`
        : message;

    this.client.log(
      messageWithUser,
      {
        facility: Syslog.Facility.Local0,
        severity: Number(process.env.SYSLOG_SERVER_LEVEL || 3),
      },
      (err) => {
        if (err) console.error('Syslog send error:', err);
      },
    );
  }
}
