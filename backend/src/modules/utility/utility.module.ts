import { MailerModule } from '@nestjs-modules/mailer';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryController } from './controllers/category.controller';
import { MediaController } from './controllers/media.controller';
import { TagController } from './controllers/tag.controller';
import { categoryFeature } from './features/category.feature';
import { mediaFeature } from './features/media.feature';
import { otpFeature } from './features/otp.feature';
import { tagFeature } from './features/tag.feature';
import { CategoryRepository } from './repositories/category.repository';
import { MediaRepository } from './repositories/media.repository';
import { OTPRepository } from './repositories/otp.repository';
import { TagRepository } from './repositories/tag.repository';
import { CategoryService } from './services/category.service';
import { CustomValidatorService } from './services/custom-validator.service';
import { MailService } from './services/mail.service';
import { MediaService } from './services/media.service';
import { MulterConfigService } from './services/multer-configuration.service';
import { OTPService } from './services/otp.service';
import { SMSService } from './services/sms.service';
import { TagService } from './services/tag.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(otpFeature),
    MongooseModule.forFeature(mediaFeature),
    MongooseModule.forFeature(tagFeature),
    MongooseModule.forFeature(categoryFeature),
    forwardRef(() => NotificationModule),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MailerModule.forRoot({
      transport: {
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
        connectionTimeout: 10000,
      },
      defaults: {
        from: `"${process.env.NODE_NAME}" <` + process.env.MAIL_FROM + '>',
      },
      template: {
        dir: join(__dirname, 'templates/mail-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    OTPService,
    OTPRepository,
    SMSService,
    MailService,
    MediaService,
    MediaRepository,
    MulterConfigService,
    /* CategoryService,
    CategoryRepository,
    TagService,
    TagRepository, */
    CustomValidatorService,
  ],
  controllers: [/* CategoryController, TagController */],
  exports: [
    OTPService,
    SMSService,
    MailService,
    MediaService,
    MulterConfigService,
/*     CategoryService,
    TagService, */
    CustomValidatorService,
  ],
})
export class UtilityModule {}
