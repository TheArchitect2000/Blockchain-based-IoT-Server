import { Injectable } from '@nestjs/common';
import { LoggingStrategyInterface } from './logging-strategy.interface';
import * as fs from 'fs';
import * as path from 'path';

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
}
