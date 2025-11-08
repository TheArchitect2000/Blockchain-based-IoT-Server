import { Injectable } from '@nestjs/common';
import { GetInternalLogDto } from './dto/get-internal-log.dto';

import * as fs from 'fs';
import * as path from 'path';
import { LogLevelEnum } from './enums/log-level.dto';

@Injectable()
export class LogInfoService {
  constructor() {}

  async getInternalLogs(
    nodeName: string,
    userId: string,
  ): Promise<GetInternalLogDto[]> {
    const logFile = path.join(process.cwd(), 'logs', 'internal.log');

    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf-8');
      const rowLogs = logs
        .split('\n')
        .filter((line: string) => line.trim() !== '');
      return rowLogs.map((line: string) => {
        const parts = line.split(',');
        const message = parts[0];
        const node = parts[1];
        const user = parts.length == 5 ? parts[4] : null;

        if ((userId && user === userId) || nodeName === node) {
          return {
            message,
            nodeName: node,
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
