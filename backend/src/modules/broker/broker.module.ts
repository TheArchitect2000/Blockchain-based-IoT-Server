import { Module, forwardRef } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { MqttLogService } from './services/mqtt-log.service';
import { MqttService } from './services/mqtt.service';
import { MqttLogController } from './controllers/mqtt-log.controller';
import { MqttController } from './controllers/mqtt.controller';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { VirtualMachineModule } from '../virtual-machine/virtual-machine.module';
import { serviceFeature } from '../service/features/service.feature';
import { installedServiceFeature } from '../service/features/installed-service.feature';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    forwardRef(() => VirtualMachineModule),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => DeviceModule),
  ],
  providers: [
    MqttService,
    MqttLogService,
  ],
  controllers: [
    MqttLogController,
    MqttController,
  ],
  exports: [
    MqttService,
    MqttLogService,
  ],
})
export class BrokerModule {}
