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
import { UserService } from 'src/modules/user/services/user/user.service';

@ApiTags('Notification')
@Controller('app/v1/notification')
export class NotificationController {
  constructor(
    private service: NotificationService,
    private readonly userService?: UserService,
  ) {}

  async isAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      (profile?.roles.some((role) => role.name === 'super_admin') == false &&
        profile?.roles.some((role) => role.name === 'notification_admin') ==
          false)
    ) {
      return false;
    } else {
      return true;
    }
  }

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
  @ApiOperation({
    summary: 'user send firebase token and server save it.',
    description: '',
  })
  //@UseGuards(JwtAuthGuard)
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
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
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
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
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
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
    return this.service.addPublicNotification(body, request.user.userId);
  }

  @Get('/get-unread-notifications-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getUnreadNotifications(
    @Param('userId') userId: string,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return this.service.getUserNotificationsByUserId(userId);
  }

  @Get('/get-all-notifications-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get notification for user when opening app or site.',
    description: '',
  })
  async getAllNotification(
    @Param('userId') userId: string,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
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
  async readNotification(
    @Body() body: ReadNotificationRequestBodyDto,
    @Request() request,
  ) {
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
    const isAdmin = await this.isAdmin(request.user.userId);
    const { notifId, ...rest } = body;
    return this.service.editNotificationById(
      notifId,
      request.user.userId,
      isAdmin,
      rest as any,
    );
  }
}
