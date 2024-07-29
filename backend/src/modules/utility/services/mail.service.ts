import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './user.entity';
import { GereralException } from '../exceptions/general.exception';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { join } from 'path';
import * as fs from 'fs';
import https from 'https';
import axios, { isCancel, AxiosError, AxiosRequestConfig } from 'axios';
import { NotificationService } from 'src/modules/notification/notification/notification.service';


@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;
    const url = 'https://programming.cpvanda.com/auth/confirm?token=${token}';

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './signup-with-token', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: user.name,
          url,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while sending email';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
  }

  async sendRegistrationToken(user: User, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;
    const url = 'https://programming.cpvanda.com/auth/confirm?token=${token}';

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to FidesInnova! Confirm your Email',
        template: './signup-with-token', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: user.name,
          url,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while sending email';
        throw new GereralException(
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

    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to FidesInnova! Confirm your Email',
        template: './signup-with-otp', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: email,
          url: url,
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
        throw new GereralException(
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

      await this.mailerService
        .sendMail({
          to: email,
          subject: 'FidesInnova. Password Reset. ',
          template: './reset-password-with-otp',
          context: {
            name: email,
            url: url,
          },
        })
        .then((data) => {
          console.log(data);
        });
      console.log('email sended');
    } catch (error) {
      console.log(error);

      let errorMessage = 'Some errors occurred while sending email';
      throw new GereralException(
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

    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'FidesInnova. Confirm Your Email. ',
        template: './verify-email-with-otp.hbs', // `.hbs` extension is appended automatically
        context: {
          // filling curly brackets with content
          name: email,
          url: url,
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
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
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

    const url =
      process.env.HOST_PROTOCOL +
      process.env.HOST_NAME_OR_IP +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-reset-password?email=' +
      email;

    console.log('url: ', url);

    if (process.env.NOTIFICATION_BY_MAIL == 'enabled') {
      await this.mailerService
        .sendMail({
          to: email,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: 'FidesInnova: Device Notification',
          template: './send-notification', // `.hbs` extension is appended automatically
          context: {
            // filling curly brackets with content
            name: email,
            notificationMessage: String(notificationMessage),
            subject: subject,
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
          throw new GereralException(
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
      axios
        .post(host + '/app/v1/notification/sendMessage', {
          message: notificationMessage,
          title: notificationTitle,
          user: userId,
        })
        .then(function (response) {
          // handle success
          //console.log(response);
        })
        .catch(function (error) {
          // handle error
          //console.log(error);
        })
        .finally(function () {
          // always executed
        });
    } else if (process.env.NOTIFICATION_BY_NOTIFICATION == 'disabled') {
      console.log(`\x1b[33m \nSending notifications is disabled.\x1b[0m`);
    }
  }
}
