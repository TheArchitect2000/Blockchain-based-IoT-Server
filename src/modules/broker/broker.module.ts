import { Module, forwardRef } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { MqttLogService } from './services/mqtt-log.service';
import { MqttService } from './services/mqtt.service';
import { MqttLogController } from './controllers/mqtt-log.controller';
import { MqttController } from './controllers/mqtt.controller';
import { MailService } from '../utility/services/mail.service';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { VirtualMachineModule } from '../virtual-machine/virtual-machine.module';
import { VirtualMachineHandlerService } from '../virtual-machine/services/service-handler.service';
import { serviceFeature } from '../service/features/service.feature';
import { installedServiceFeature } from '../service/features/installed-service.feature';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from '../service/services/service.service';
import { InstalledServiceService } from '../service/services/installed-service.service';
import { InstalledServiceRepository } from '../service/repositories/installed-service.repository';
import { ServiceRepository } from '../service/repositories/service.repository';
import { ServiceController } from '../service/controllers/service.controller';
import { ServiceHandlerController } from '../virtual-machine/controllers/service-handler.controller';
import { InstalledServiceController } from '../service/controllers/installed-service.controller';
import { UserController } from '../user/controllers/user.controller';


@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    forwardRef(() => DeviceModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => UserModule),
    forwardRef(() => VirtualMachineModule),
  ],
  providers: [
    MqttService,
    MqttLogService,
    MailService,
    VirtualMachineHandlerService,
    ServiceService,
    InstalledServiceService,
    InstalledServiceRepository,
    ServiceRepository,
  ],
  controllers: [
    MqttLogController,
    MqttController,
    ServiceController,
    ServiceHandlerController,
    InstalledServiceController,
    UserController,
  ],
  exports: [
    MqttService,
    MqttLogService,
    MailService,
    VirtualMachineHandlerService,
    ServiceService,
    InstalledServiceService,
    InstalledServiceRepository,
    ServiceRepository,
  ],

})
export class BrokerModule {}
