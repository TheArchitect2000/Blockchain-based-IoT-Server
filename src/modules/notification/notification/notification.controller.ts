import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
import {
  AddNotificationByEmailRequestBodyDto,
  AddNotificationRequestBodyDto,
  AddPublicNotificationRequestBodyDto,
  EditNotificationRequestBodyDto,
  ReadNotificationRequestBodyDto,
} from '../dto/notification.dto';

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
  async addNotificationByUserId(
    @Body() body: AddNotificationRequestBodyDto,
    @Request() request,
  ) {
    return this.service.addNotificationForUserById(body, request.user.userId);
  }

  @Post('/add-notification-by-user-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'add notification for user when opening app or site.',
    description: '',
  })
  async addNotificationByEmail(
    @Body() body: AddNotificationByEmailRequestBodyDto,
  ) {
    return this.service.addNotificationForUserByEmail(body);
  }

  @Post('/add-public-notification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'add notification for all users when opening app or site.',
    description: '',
  })
  async addPublicNotification(
    @Body() body: AddPublicNotificationRequestBodyDto,
    @Request() request,
  ) {
    return this.service.addPublicNotification(body, request.user.userId);
  }

  @Get('/get-unread-notifications-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getUnreadNotifications(@Param('userId') userId: string) {
    return this.service.getUserNotificationsByUserId(userId);
  }

  @Get('/get-all-notifications-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getAllNotification(@Param('userId') userId: string) {
    return this.service.getAllUserNotificationsByUserId(userId);
  }

  @Get('/get-public-notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get public notifications for all users when opening app or site.',
    description: '',
  })
  async getPublicNotifications() {
    return this.service.getPublicNotifications();
  }

  @Get('/get-notification-by-id/:notifId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getNotificationById(@Param('notifId') notifId: string) {
    return this.service.getNotificationById(notifId);
  }

  @Patch('/read-notification-by-notif-id-list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'add notification for user when opening app or site.',
    description: '',
  })
  async readNotification(@Body() body: ReadNotificationRequestBodyDto) {
    return this.service.readNotificationsByNotificationIds(body.notifications);
  }

  @Patch('/edit-notification-by-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "edit notification by it's id.",
    description: '',
  })
  async editNotification(
    @Body() body: EditNotificationRequestBodyDto,
    @Request() request,
  ) {
    const { notifId, ...rest } = body;
    return this.service.editNotificationById(notifId, rest as any);
  }
}
