import { Injectable } from '@nestjs/common';
import { LoggingStrategyInterface } from './logging-strategy.interface';
import * as fs from 'fs';
import * as path from 'path';
import { GetInternalLogDto } from '../dto/get-internal-log.dto';
import { LogLevelEnum } from '../enums/log-level.dto';

@Injectable()
export class InternalStrategy implements LoggingStrategyInterface {
  constructor(
    private readonly nodeName: string,
    private readonly maxSize: number,
  ) {}

  log(message: string, userId?: string): void {
    message += `,${LogLevelEnum.DEBUG},${new Date().toISOString()},${
      this.nodeName
    }`;
    if (userId) {
      message += `,${userId}`;
    }

    const logFile = path.join(process.cwd(), 'logs', 'internal.log');
    const dir = path.dirname(logFile);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const maxSize = this.maxSize * 1024 * 1024;
    if (fs.existsSync(logFile) && fs.statSync(logFile).size >= maxSize) {
      throw new Error('Log file size exceeded the maximum limit.');
    }

    fs.appendFileSync(logFile, message + '\n');
  }

  getLogs(userId?: string): GetInternalLogDto[] {
    const logFile = path.join(process.cwd(), 'logs', 'internal.log');

    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf-8');
      const rowLogs = logs
        .split('\n')
        .filter((line: string) => line.trim() !== '');
      return rowLogs.map((line: string) => {
        const parts = line.split(',');
        const message = parts[0];
        const nodeName = parts[1];
        const user = parts.length == 5 ? parts[4] : null;

        if ((userId && user === userId) || this.nodeName === nodeName) {
          return {
            message,
            nodeName,
            level: parts[2] as LogLevelEnum,
            timestamp: parts[3],
            user,
          };
        }
      });
    } else {
      return [];
    }
  }
}
