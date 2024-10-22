import { Controller, HttpCode, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller('app')
export class AdminController {
  constructor(private readonly adminService?: AdminService) {}

}
