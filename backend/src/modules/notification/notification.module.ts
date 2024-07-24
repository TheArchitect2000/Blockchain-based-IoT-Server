import { Module, forwardRef } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { notificationFeature } from './notification/notification.feature';
import { NotificationRepository } from './notification/notification.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature(notificationFeature),
    forwardRef(() => UserModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
