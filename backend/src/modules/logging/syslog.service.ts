import { Injectable } from '@nestjs/common';
import * as Syslog from 'syslog-client';

@Injectable()
export class SyslogService {
  private client: Syslog.Client | null = null;
  private enabled = false;
  private username: string;
  private password: string;

  constructor() {
    this.enabled = process.env.Syslog_Server_Enabled === 'True';
    this.username = process.env.Syslog_Server_Username || '';
    this.password = process.env.Syslog_Server_Password || '';

    if (this.enabled) {
      this.client = Syslog.createClient(process.env.Syslog_Server_Host, {
        port: Number(process.env.Syslog_Server_Port || 514),
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
        severity: Number(process.env.Syslog_Serverl_Level || 3),
      },
      (err) => {
        if (err) console.error('Syslog send error:', err);
      },
    );
  }
}
