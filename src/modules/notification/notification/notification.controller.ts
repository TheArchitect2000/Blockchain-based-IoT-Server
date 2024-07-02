import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { SendTokenRequestBodyDto } from '../dto/send-token';
import { SendNotificationRequestBodyDto } from '../dto/send-notif-dto';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { AddNotificationRequestBodyDto, SeenNotificationRequestBodyDto } from '../dto/notification.dto';

@ApiTags('Notification')
@Controller('app/v1/notification')
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Post('/sendToken')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'user send firebase token and server save it.',
    description: '',
  })
  @ApiBearerAuth()
  async sendFirebaseToken(
    @Body() body: SendTokenRequestBodyDto,
    @Request() request,
  ) {
    const { token } = body;
    return this.service.sendToken(token, request.user.userId);
  }

  @Post('/sendMessage')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'user send firebase token and server save it.',
    description: '',
  })
  //@ApiBearerAuth()
  async sendNotification(@Body() body: SendNotificationRequestBodyDto) {
    const { user } = body;
    if (!Types.ObjectId.isValid(String(user)))
      throw new GereralException(
        ErrorTypeEnum.INVALID_INPUT,
        'userId must be valid type',
      );
    return this.service.sendNotification(body);
  }

  @Post('/add-notification-by-user-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'add notification for user when opening app or site.',
    description: '',
  })
  async addNotification(
    @Body() body: AddNotificationRequestBodyDto,
    @Request() request,
  ) {
    return this.service.addNotificationForUserById(body, request.user.userId);
  }

  @Get('/get-notification-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getNotification(@Param('userId') userId: string) {
    
    return this.service.getUserNotificationUserById(userId);
  }

  /* @Post('/seen-notification-by-user-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'add notification for user when opening app or site.',
    description: '',
  })
  async seenNotification(
    @Body() body: SeenNotificationRequestBodyDto,
    @Request() request,
  ) {
    return this.service.addNotificationForUserById(body, request.user.userId);
  } */

}
