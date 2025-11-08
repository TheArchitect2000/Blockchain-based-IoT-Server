import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { LogInfoService } from './log-info.service';

@ApiTags('Manage Activity Logs')
@Controller('app')
export class LogController {
  /**
   *
   */
  constructor(
    @Inject(LogInfoService)
    private readonly logService: LogInfoService,
  ) {}

  @Get('v1/logs')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLogs(@Request() request) {
    return this.logService.getInternalLogs(
      process.env.NODE_NAME,
      request.user.userId,
    );
  }
}
