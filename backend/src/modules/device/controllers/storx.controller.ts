import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StorxService } from '../services/storx.service';

@ApiTags('StorX')
@Controller('app')
export class StorXController {
  constructor(private readonly storxService: StorxService) {}

  @Get('v1/storx/construct-uri')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Construct StorX Authentication URI',
    description: 'Construct StorX Authentication URI',
  })
  async constructUrl() {
    return {
      uri: await this.storxService.constructUri(),
    };
  }

  @Get('v1/storx/callback')
  @HttpCode(200)
  async callback(@Query('access_grant') accessGrant: string) {
    await this.storxService.handleCallback(accessGrant);
    return {
      message: 'Callback received',
    };
  }
}
