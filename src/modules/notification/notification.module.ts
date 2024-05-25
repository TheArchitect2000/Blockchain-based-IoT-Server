import { Module } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userFeature } from '../user/features/user.feature';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature(userFeature), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
