import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(), //  It will load the contents of the .env file automatically.
    MongooseModule.forFeature(otpFeature),
    MongooseModule.forFeature(mediaFeature),
    MongooseModule.forFeature(tagFeature),
    MongooseModule.forFeature(categoryFeature),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MailerModule.forRoot({
      //  Add this code in nest-cli.json:
      //  "compilerOptions": {
      //    "assets": ["modules/utility/templates/mail-templates/**/*"],
      //    "watchAssets": true
      //   }

      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        // host: 'mail.cpvanda.com',
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          // user: 'noreply@fidesinnova.io',
          user: process.env.MAIL_USER,
          // pass: 'salam1234',
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        // from: '"FidesInnova" <noreply@fidesinnova.io>',
        from: '"FidesInnova" <' + process.env.MAIL_FROM + '>',
      },
      template: {
        dir: join(__dirname, 'templates/mail-templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
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
