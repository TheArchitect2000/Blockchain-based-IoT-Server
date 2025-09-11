import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { StorxService } from '../services/storx.service';
import { Response } from 'express';
import { InsertStorxDto } from '../data-transfer-objects/insert-storx.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';

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

  @Post('v1/storx/credentials')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Save StorX Credentials',
    description: 'Save StorX Credentials',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async saveCredentials(@Body() body: InsertStorxDto, @Request() request) {
    return this.storxService.saveCredentials(body, request.user.userId);
  }

  @Get('v1/storx/credentials')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get StorX Credentials',
    description: 'Get StorX Credentials',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCredentials(@Request() request) {
    return this.storxService.getCredentials(request.user.userId);
  }
}
