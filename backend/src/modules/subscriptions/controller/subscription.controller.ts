import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';
import { join } from 'path';
var fs = require('fs');
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { SetEmailSubscriptionBodyDto } from '../dto/subscriptions.dto';

@ApiTags('Subscriptions')
@Controller('app/v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService?: SubscriptionsService) {}

  /* @Post('/get-unsubscribe-token')
  @HttpCode(200)
  async getToken(@Query('userId') userId: string) {
    return this.subscriptionsService.generateAndsaveUserToken(userId);
  } */

  @Get('/unsubscribe-email')
  @HttpCode(200)
  async unsubscribeEmailWithToken(
    @Query('token') token: string,
    @Response() res: Res,
  ) {
    try {
      await this.subscriptionsService.unsubscribeEmailWithToken(token);

      const filePath = join(
        __dirname,
        '../../../../assets/web-pages/unsubscribe-congrat-msg.html',
      );

      let htmlContent = await fs.promises.readFile(filePath, 'utf8');

      htmlContent = htmlContent
        .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
        .replace(/{{NodeName}}/g, process.env.NODE_NAME);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(htmlContent);
      res.end();
    } catch (error) {
      // Show unsuccessful page
      try {
        const errorFilePath = join(
          __dirname,
          '../../../../assets/web-pages/unsubscribe-unsuccessful-msg.html',
        );
        const pgResp = await fs.promises.readFile(errorFilePath, 'utf8');

        const responseHtml = pgResp
          .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
          .replace(/{{NodeName}}/g, process.env.NODE_NAME);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(responseHtml);
      } catch (readError) {
        console.error('Error reading unsuccessful message page:', readError);
        res.writeHead(404);
        res.write('Response web page does not found!');
      } finally {
        res.end();
      }
    }
  }

  @Get('/check-my-email-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async chechUser(@Request() request) {
    const isUnsubscribed: boolean =
      await this.subscriptionsService.checkUserUnsubscribed(
        request.user.userId,
      );
    return !isUnsubscribed;
  }

  @Post('/set-email-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async setEmailSubscription(
    @Body() body: SetEmailSubscriptionBodyDto,
    @Request() request,
  ) {
    const res = await this.subscriptionsService.setEmailSubscriptionWithUserId(
      request.user.userId,
      body.subscribe,
    );
    return res;
  }
}
