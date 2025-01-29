import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { BlocklyModule } from './modules/blockly/blockly.module';
import { BrokerModule } from './modules/broker/broker.module';
import { DeviceModule } from './modules/device/device.module';
import { ContractModule } from './modules/smartcontract/contract.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PanelModule } from './modules/panel/panel.module';
import { ServiceModule } from './modules/service/service.module';
import { UserModule } from './modules/user/user.module';
import databaseConfig from './modules/utility/configurations/database.configuration';
import multerConfig from './modules/utility/configurations/multer.configuration';
import { ResponseTransformInterceptor } from './modules/utility/interceptors/response-transform.interceptor';
import { UtilityModule } from './modules/utility/utility.module';
import { MediaModule } from './modules/media/media.module';
import { AdminModule } from './modules/admin/admin.module';
import { BuildingModule } from './modules/building/building.module';
//import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    //ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [databaseConfig, multerConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),

    ServeStaticModule.forRoot({
      rootPath: './uploads',
      serveRoot: '/app/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: './uploads/*',
      serveRoot: '/app/uploads/*',
    }),
    AuthenticationModule,
    UserModule,
    BrokerModule,
    forwardRef(() => DeviceModule),
    UtilityModule,
    //PanelModule,
    ServiceModule,
    BlocklyModule,
    NotificationModule,
    BuildingModule,
    ContractModule,
    MediaModule,
    AdminModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    AppService,
  ],
  exports: [AppService],
})
export class AppModule {}
