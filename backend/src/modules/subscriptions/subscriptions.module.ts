import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsController } from './controller/subscription.controller';
import { subscriptionFeature } from './feature/subscriptions.feature';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsRepository } from './repository/subscription.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature(subscriptionFeature),
    forwardRef(() => UserModule),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
