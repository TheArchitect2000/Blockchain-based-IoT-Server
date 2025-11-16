import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './user.entity';
import { GeneralException } from '../exceptions/general.exception';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { NotificationService } from 'src/modules/notification/notification/notification.service';
import { SubscriptionsService } from 'src/modules/subscriptions/services/subscriptions.service';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private validateTokenUrl = `${process.env.HOST_PROTOCOL}${process.env.PANEL_URL}/${process.env.HOST_SUB_DIRECTORY}/v1/subscriptions/unsubscribe-email?token=`;
  private templatesCache = new Map<string, handlebars.TemplateDelegate>();

  constructor(
    private readonly notificationService?: NotificationService,
    private readonly subscriptionsService?: SubscriptionsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService?: UserService,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT.toString()),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async getTemplate(
    templateName: string,
  ): Promise<handlebars.TemplateDelegate> {
    if (this.templatesCache.has(templateName)) {
      return this.templatesCache.get(templateName);
    }

    try {
      const templatePath = path.join(
        process.cwd(),
        'src/modules/utility/templates/mail-templates',
        `${templateName}.hbs`,
      );
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateContent);

      this.templatesCache.set(templateName, compiledTemplate);
      return compiledTemplate;
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        `Template ${templateName} not found or invalid`,
      );
    }
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    template?: string;
    context?: any;
    html?: string;
    attachments?: any[];
  }) {
    try {
      let html = options.html;

      if (options.template && options.context) {
        const template = await this.getTemplate(options.template);
        html = template(options.context);
      }

      const mailOptions = {
        from: process.env.MAIL_FROM || '"Support Team" <noreply@example.com>',
        to: options.to,
        subject: options.subject,
        html,
        attachments: options.attachments || [],
      };

      const result = await this.transporter.sendMail(mailOptions);

      return result;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Some errors occurred while sending email',
      );
    }
  }

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
    const url = `https://programming.cpvanda.com/auth/confirm?token=${token}`;
    const userToken = await this.getTokenWithUserEmail(user.email);

    await this.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'signup-with-token',
      context: {
        name: user.name,
        NodeName: process.env.NODE_NAME,
        url,
        unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
      },
      attachments: [
        {
          filename: 'fides_logo.png',
          path: `${process.cwd()}/uploads/fides_logo.png`,
          cid: 'fidesinnova_logo',
        },
      ],
    });
  }

  async sendChangeEmailToken(user: User, token: string) {
    await this.sendMail({
      to: user.email,
      subject: `Confirm Your Email Address Update - ${process.env.NODE_NAME}`,
      template: 'change-email-token',
      context: {
        NodeName: process.env.NODE_NAME,
        NodeImageSrc: process.env.THEME_LOGO,
        token_1: token[0],
        token_2: token[1],
        token_3: token[2],
        token_4: token[3],
        token_5: token[4],
      },
      attachments: [
        {
          filename: 'fides_logo.png',
          path: `${process.cwd()}/uploads/fides_logo.png`,
          cid: 'fidesinnova_logo',
        },
      ],
    });
  }

  async sendRegistrationToken(user: User, token: string) {
    const url = `https://programming.cpvanda.com/auth/confirm?token=${token}`;
    const userToken = await this.getTokenWithUserEmail(user.email);

    await this.sendMail({
      to: user.email,
      subject: `Welcome to ${process.env.NODE_NAME}! Confirm your Email`,
      template: 'signup-with-token',
      context: {
        name: user.name,
        NodeName: process.env.NODE_NAME,
        url,
        unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
      },
      attachments: [
        {
          filename: 'fides_logo.png',
          path: `${process.cwd()}/uploads/fides_logo.png`,
          cid: 'fidesinnova_logo',
        },
      ],
    });
  }

  async sendRegistrationOTP(email: string, otp: string, otpType: string) {
    const url =
      process.env.HOST_PROTOCOL +
      process.env.PANEL_URL +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-signup?email=' +
      email +
      '&otp=' +
      otp;

    await this.sendMail({
      to: email,
      subject: `Verify Your Email for ${process.env.NODE_NAME} - ${process.env.NODE_NAME}`,
      template: 'signup-with-otp',
      context: {
        name: email,
        NodeName: process.env.NODE_NAME,
        NodeImageSrc: process.env.THEME_LOGO,
        url: url,
      },
      attachments: [
        {
          filename: 'fides_logo.png',
          path: `${process.cwd()}/uploads/fides_logo.png`,
          cid: 'fidesinnova_logo',
        },
      ],
    });
  }

  async sendChangePasswordOTP(email: string, otp: string, otpType: string) {
    const url =
      process.env.HOST_PROTOCOL +
      process.env.PANEL_URL +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-reset-password?email=' +
      email +
      '&otp=' +
      otp;

    try {
      const userToken = await this.getTokenWithUserEmail(email);

      await this.sendMail({
        to: email,
        subject: `Password Reset Request - ${process.env.NODE_NAME}`,
        template: 'reset-password-with-otp',
        context: {
          name: email,
          NodeName: process.env.NODE_NAME,
          NodeImageSrc: process.env.THEME_LOGO,
          url: url,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
        attachments: [
          {
            filename: 'fides_logo.png',
            path: `${process.cwd()}/uploads/fides_logo.png`,
            cid: 'fidesinnova_logo',
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Some errors occurred while sending email',
      );
    }
  }

  async sendVerifyEmailOTP(email: string, otp: string, otpType: string) {
    const url =
      process.env.HOST_PROTOCOL +
      process.env.PANEL_URL +
      '/' +
      process.env.HOST_SUB_DIRECTORY +
      '/v1/user/verify-otp-code-sent-by-email-for-verify-email?email=' +
      email +
      '&otp=' +
      otp;

    const userToken = await this.getTokenWithUserEmail(email);

    await this.sendMail({
      to: email,
      subject: `Please Verify Your Email - ${process.env.NODE_NAME}`,
      template: 'verify-email-with-otp',
      context: {
        name: email,
        NodeName: process.env.NODE_NAME,
        NodeImageSrc: process.env.THEME_LOGO,
        url: url,
        unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
      },
      attachments: [
        {
          filename: 'fides_logo.png',
          path: `${process.cwd()}/uploads/fides_logo.png`,
          cid: 'fidesinnova_logo',
        },
      ],
    });
  }

  async getCurrentTimeFormatted() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
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
    if (process.env.NOTIFICATION_BY_MAIL == 'enabled') {
      const userToken = await this.getTokenWithUserEmail(email);
      const currentTime = await this.getCurrentTimeFormatted();

      await this.sendMail({
        to: email,
        subject: `Device Notification Received - ${process.env.NODE_NAME}`,
        template: 'send-notification',
        context: {
          name: email,
          NodeName: process.env.NODE_NAME,
          NodeImageSrc: process.env.THEME_LOGO,
          notificationMessage: String(notificationMessage),
          subject: subject,
          date: currentTime,
          unsubscribeEmailUrl: `${this.validateTokenUrl}${userToken}`,
        },
        attachments: [
          {
            filename: 'fides_logo.png',
            path: `${process.cwd()}/uploads/fides_logo.png`,
            cid: 'fidesinnova_logo',
          },
        ],
      });
    }
  }

  async sendNotificationFromService(
    userId: string,
    notificationTitle: string,
    notificationMessage: string,
  ) {
    if (process.env.NOTIFICATION_BY_NOTIFICATION == 'enabled') {
      this.notificationService.sendNotification({
        message: notificationMessage,
        title: notificationTitle,
        user: userId,
      });
    }
  }
}
