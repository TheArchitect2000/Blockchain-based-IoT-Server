import { Controller, Get, HttpCode, Inject, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { LogInfoService } from './log-info.service';
import { UserService } from '../user/services/user/user.service';

@ApiTags('Manage Activity Logs')
@Controller('app')
export class LogController {
  /**
   *
   */
  constructor(
    @Inject(LogInfoService)
    private readonly logService: LogInfoService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) { }

  @Get('v1/logs')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLogs(@Request() request) {
    const isAdmin = await this.isAdmin(request.user.userId);
    return this.logService.getInternalLogs(process.env.NODE_NAME, isAdmin ? null : request.user.userId);
  }

  async isAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      (profile?.roles.some((role) => role.name === 'super_admin') == false &&
        profile?.roles.some((role) => role.name === 'device_admin') == false)
    ) {
      return false;
    } else {
      return true;
    }
  }
}
