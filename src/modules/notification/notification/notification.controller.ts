import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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
}
