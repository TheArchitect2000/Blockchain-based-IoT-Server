import { LogLevelEnum } from '../enums/log-level.dto';

export class GetInternalLogDto {
  message: string;
  userId?: string;
  nodeName: string;
  timestamp: string;
  level: LogLevelEnum;
}
