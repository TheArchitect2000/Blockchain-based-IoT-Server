import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from '../device/device.module';
import { MqttLogService } from './services/mqtt-log.service';
import { MqttService } from './services/mqtt.service';
import { MqttLogController } from './controllers/mqtt-log.controller';
import { MqttController } from './controllers/mqtt.controller';
import { VirtualMachineModule } from '../virtual-machine/virtual-machine.module';
import { serviceFeature } from '../service/features/service.feature';
import { installedServiceFeature } from '../service/features/installed-service.feature';

@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    DeviceModule,
    VirtualMachineModule,
  ],
  providers: [MqttService, MqttLogService],
  controllers: [MqttLogController, MqttController],
  exports: [MqttService, MqttLogService],
})
export class BrokerModule {}
