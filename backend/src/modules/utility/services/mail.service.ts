import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './user.entity';
import { GeneralException } from '../exceptions/general.exception';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { NotificationService } from 'src/modules/notification/notification/notification.service';
import { SubscriptionsService } from 'src/modules/subscriptions/services/subscriptions.service';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class MailService {
  private validateTokenUrl = `${process.env.HOST_PROTOCOL}${process.env.HOST_NAME_OR_IP}/${process.env.HOST_SUB_DIRECTORY}/v1/subscriptions/unsubscribe-email?token=`;

  constructor(
    private readonly mailerService?: MailerService,
    private readonly notificationService?: NotificationService,
    private readonly subscriptionsService?: SubscriptionsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService?: UserService,
  ) {}

  async getUserIdByEmail(email: string) {
    const res = await this.userService.getUserByEmail(email);
    return res._id;
  }

  async generateUserUnsubscribeToken(userId: string) {
    const res = await this.subscriptionsService.generateAndsaveUserToken(
      userId,
    );
    return res.token;
  }

  async getTokenWithUserEmail(email: string) {
    const theUserId = await this.getUserIdByEmail(email);
    const theToken = await this.generateUserUnsubscribeToken(theUserId);
    return theToken;
  }

  async isUserUnsubscribed(userEmail: string) {
    const theUserId = await this.getUserIdByEmail(userEmail);
    const res = await this.subscriptionsService.checkUserUnsubscribed(
      theUserId,
    );
    return res;
  }

  async sendUserConfirmation(user: User, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;
    const url = 'https://programming.cpvanda.com/auth/confirm?token=${token}';

    /* if (await this.isUserUnsubscribed(user.email)) {
      return false;
    } */

    const userToken = await this.getTokenWithUserEmail(user.email);

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './signup-with-token', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: user.name,
          NodeName: process.env.NODE_NAME,
          url,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while sending email';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async sendChangeEmailToken(user: User, token: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `Confirm Your Email Address Update - ${process.env.NODE_NAME}`,
        template: './change-email-token', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          NodeName: process.env.NODE_NAME,
          NodeImageSrc: process.env.THEME_LOGO,
          token_1: token[0],
          token_2: token[1],
          token_3: token[2],
          token_4: token[3],
          token_5: token[4],
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Erorrrrrrrrrrrrr:", error);
        
        let errorMessage = 'Some errors occurred while sending email';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async sendRegistrationToken(user: User, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;
    const url = 'https://programming.cpvanda.com/auth/confirm?token=${token}';

    /* if (await this.isUserUnsubscribed(user.email)) {
      return false;
    } */

    const userToken = await this.getTokenWithUserEmail(user.email);

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `Welcome to ${process.env.NODE_NAME}! Confirm your Email`,
        template: './signup-with-token', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: user.name,
          NodeName: process.env.NODE_NAME,
          url,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while sending email';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async sendRegistrationOTP(email: string, otp: string, otpType: string) {
    console.log(
      'We are in sendRegistrationOTP email is: ',
      email,
      '   and OTP is: ',
      otp,
    );

    const url =
      process.env.HOST_PROTOCOL +
      process.env.HOST_NAME_OR_IP +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-signup?email=' +
      email +
      '&otp=' +
      otp;

    console.log('email url: ', url);

    /* if (await this.isUserUnsubscribed(email)) {
      return false;
    } */

    const userToken = await this.getTokenWithUserEmail(email);

    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `Verify Your Email for ${process.env.NODE_NAME} - ${process.env.NODE_NAME}`,
        template: './signup-with-otp', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: email,
          NodeName: process.env.NODE_NAME,
          NodeImageSrc: process.env.THEME_LOGO,
          url: url,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
        /*attachments: [
          {
            filename: 'logo-fidesinnova-black.png',
            // path: __dirname +'../../../../../assets/images/logo-fidesinnova-black.png',
            path: join(
              __dirname,
              '../../../../assets/images/logo-fidesinnova-black.png',
            ),
            cid: 'logo',
          },
        ],*/
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);

        let errorMessage = 'Some errors occurred while sending email';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async sendChangePasswordOTP(email: string, otp: string, otpType: string) {
    console.log(
      'We are in sendChangePasswordOTP email is: ',
      email,
      ', and OTP is: ',
      otp,
    );

    const url =
      process.env.HOST_PROTOCOL +
      process.env.HOST_NAME_OR_IP +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-reset-password?email=' +
      email +
      '&otp=' +
      otp;

    console.log('url 22: ', url);

    try {
      console.log('Sending email');

      /* if (await this.isUserUnsubscribed(email)) {
        return false;
      } */

      const userToken = await this.getTokenWithUserEmail(email);

      await this.mailerService
        .sendMail({
          to: email,
          subject: `Password Reset Request - ${process.env.NODE_NAME}`,
          template: './reset-password-with-otp',
          context: {
            name: email,
            NodeName: process.env.NODE_NAME,
            NodeImageSrc: process.env.THEME_LOGO,
            url: url,
            unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
          },
        })
        .then((data) => {
          console.log(data);
        });
      console.log('email sended');
    } catch (error) {
      console.log(error);

      let errorMessage = 'Some errors occurred while sending email';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
    console.log('email sended 2');
  }

  async sendVerifyEmailOTP(email: string, otp: string, otpType: string) {
    console.log(
      'We are in sendVerifyEmailOTP email is: ',
      email,
      '   and OTP is: ',
      otp,
    );

    const url =
      process.env.HOST_PROTOCOL +
      process.env.HOST_NAME_OR_IP +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-verify-email?email=' +
      email +
      '&otp=' +
      otp;

    console.log('url: ', url);

    /* if (await this.isUserUnsubscribed(email)) {
      return false;
    } */

    const userToken = await this.getTokenWithUserEmail(email);

    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `Please Verify Your Email - ${process.env.NODE_NAME}`,
        template: './verify-email-with-otp.hbs', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: email,
          NodeName: process.env.NODE_NAME,
          NodeImageSrc: process.env.THEME_LOGO,
          url: url,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
        /*attachments: [
          {
            filename: 'logo-fidesinnova-black.png',
            // path: __dirname +'../../../../../assets/images/logo-fidesinnova-black.png',
            path: join(
              __dirname,
              '../../../../assets/images/logo-fidesinnova-black.png',
            ),
            cid: 'logo',
          },
        ],*/
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);

        let errorMessage = 'Some errors occurred while sending email';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async getCurrentTimeFormatted() {
    const now = new Date();

    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year}, ${hours}:${minutes}`;
  }

  async sendEmailFromService(
    email: string,
    notificationMessage: string,
    subject: string,
  ) {
    console.log(
      'We are in sendEmailFromService email is: ',
      email,
      '   and notification message is: ',
      notificationMessage,
    );

    if (process.env.NOTIFICATION_BY_MAIL == 'enabled') {
      /* if (await this.isUserUnsubscribed(email)) {
        return false;
      } */

      const userToken = await this.getTokenWithUserEmail(email);

      const currentTime = await this.getCurrentTimeFormatted()

      await this.mailerService
        .sendMail({
          to: email,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: `Device Notification Received - ${process.env.NODE_NAME}`,
          template: './send-notification', // `.hbs` extension is appended automatically
          context: {
            // filling curly brackets with content
            name: email,
            NodeName: process.env.NODE_NAME,
            NodeImageSrc: process.env.THEME_LOGO,
            notificationMessage: String(notificationMessage),
            subject: subject,
            date: currentTime,
            unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
          },
          /*attachments: [
            {
              filename: 'logo-fidesinnova-black.png',
              // path: __dirname +'../../../../../assets/images/logo-fidesinnova-black.png',
              path: join(
                __dirname,
                '../../../../assets/images/logo-fidesinnova-black.png',
              ),
              cid: 'logo',
            },
          ],*/
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);

          let errorMessage = 'Some errors occurred while sending email' + error;
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else if (process.env.NOTIFICATION_BY_MAIL == 'disabled') {
      console.log(`\x1b[33m \nSending email is disabled.\x1b[0m`);
    }
  }

  async sendNotificationFromService(
    userId: string,
    notificationTitle: string,
    notificationMessage: string,
  ) {
    console.log(
      'We are in sendNotifacattionFromService userId is: ',
      userId,
      '   and notification title is: ',
      notificationTitle,
      '   and notification message is: ',
      notificationMessage,
    );

    const host = 'https://' + process.env.HOST_NAME_OR_IP;
    if (process.env.NOTIFICATION_BY_NOTIFICATION == 'enabled') {
      this.notificationService.sendNotification({
        message: notificationMessage,
        title: notificationTitle,
        user: userId,
      });
      /* axios
        .post(host + '/app/v1/notification/sendMessage', {
          message: notificationMessage,
          title: notificationTitle,
          user: userId,
        }) */
    } else if (process.env.NOTIFICATION_BY_NOTIFICATION == 'disabled') {
      console.log(`\x1b[33m \nSending notifications is disabled.\x1b[0m`);
    }
  }
}
