// virtual-machine.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { UtilityModule } from '../utility/utility.module';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { BrokerModule } from '../broker/broker.module';
import { VirtualMachineHandlerService } from './services/service-handler.service';
import { ServiceRepository } from '../service/repositories/service.repository';
import { InstalledServiceRepository } from '../service/repositories/installed-service.repository';
import { ServiceService } from '../service/services/service.service';
import { InstalledServiceService } from '../service/services/installed-service.service';
import { ServiceHandlerController } from './controllers/service-handler.controller';
import { InstalledServiceController } from '../service/controllers/installed-service.controller';
import { MqttController } from '../broker/controllers/mqtt.controller';
import { MqttService } from '../broker/services/mqtt.service';
import { ServiceController } from '../service/controllers/service.controller';
import { UserInfoController } from '../user/controllers/user-info.controller';
import { UserController } from '../user/controllers/user.controller';
import { MqttLogController } from '../broker/controllers/mqtt-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { serviceFeature } from '../service/features/service.feature';
import { installedServiceFeature } from '../service/features/installed-service.feature';
import { MqttLogService } from '../broker/services/mqtt-log.service';

@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    forwardRef(() => BrokerModule),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => UtilityModule),
  ],
  providers: [VirtualMachineHandlerService],
  controllers: [ServiceHandlerController],
  exports: [VirtualMachineHandlerService],
})
export class VirtualMachineModule {}
