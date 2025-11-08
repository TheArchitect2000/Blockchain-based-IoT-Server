import { Controller, Get, HttpCode, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';

@ApiTags('Manage Activity Logs')
@Controller('logs')
export class LogController {
  /**
   *
   */
  constructor(
    @Inject(LogService)
    private readonly logService: LogService,
  ) {}

  @Get('')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLogs() {
    return this.logService.getInternalLogs();
  }
}
