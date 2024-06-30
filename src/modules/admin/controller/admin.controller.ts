import { Controller, HttpCode, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller('app')
export class AdminController {
  constructor(private readonly adminService?: AdminService) {}

  @Get('v1/admin/node-servers')
  @HttpCode(201)
  @ApiOperation({
    summary: 'getting node servers.',
    description: 'This api is returning node servers.',
  })
  async getNodeServers(@Request() request) {
    const nodeServers = JSON.parse(process.env.NODE_SERVERS);
    return nodeServers;
  }
}
