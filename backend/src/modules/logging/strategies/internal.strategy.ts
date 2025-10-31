import { Injectable } from '@nestjs/common';
import { LoggingStrategyInterface } from './logging-strategy.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InternalStrategy implements LoggingStrategyInterface {
  constructor(
    private readonly nodeName: string,
    private readonly maxSize: number,
  ) {}

  log(message: string, userId?: string): void {
    if (userId) {
      message += `,${userId},${this.nodeName}`;
    } else {
      message += `,${this.nodeName}`;
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
