import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { BlocklyModule } from './modules/blockly/blockly.module';
import { BrokerModule } from './modules/broker/broker.module';
import { DeviceModule } from './modules/device/device.module';
import { ZkpModule } from './modules/zkp/zkp.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PanelModule } from './modules/panel/panel.module';
import { ServiceModule } from './modules/service/service.module';
import { UserModule } from './modules/user/user.module';
import databaseConfig from './modules/utility/configurations/database.configuration';
import multerConfig from './modules/utility/configurations/multer.configuration';
import { ResponseTransformInterceptor } from './modules/utility/interceptors/response-transform.interceptor';
import { UtilityModule } from './modules/utility/utility.module';
import { VirtualMachineModule } from './modules/virtual-machine/virtual-machine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [databaseConfig, multerConfig],
    }),

    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION,
      // `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_CONNECTION}`
      /* {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      } */
      /* {
        connectionName: 'appDb',
      } */
    ),
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_PANEL,
      // 'mongodb+srv://<username>:<passowrd>@cluster0-igk.mongodb.net/WildLife?retryWrites=true&w=majority'
      {
        connectionName: 'panelDb',
      },
    ),
    AuthenticationModule,
    UserModule,
    BrokerModule,
    DeviceModule,
    UtilityModule,
    PanelModule,
    ServiceModule,
    BlocklyModule,
    VirtualMachineModule,
    NotificationModule,
    ZkpModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
