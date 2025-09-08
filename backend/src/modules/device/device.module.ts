import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { deviceLogFeature } from './features/device-log.feature';
import { deviceFeature } from './features/device.feature';
import { deviceTypeFeature } from './features/device-type.feature';
import { DeviceLogService } from './services/device-log.service';
import { DeviceService } from './services/device.service';
import { DeviceTypeService } from './services/device-type.service';
import { DeviceLogRepository } from './repositories/device-log.repository';
import { DeviceRepository } from './repositories/device.repository';
import { DeviceTypeRepository } from './repositories/device-type.repository';
import { DeviceController } from './controllers/device.controller';
import { DeviceTypeController } from './controllers/device-type.controller';
import { DeviceLogController } from './controllers/device-log.controller';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { ServiceModule } from '../service/service.module';
import { VirtualMachineModule } from '../virtual-machine/virtual-machine.module';
import { ContractModule } from '../smartcontract/contract.module';
import { AppModule } from 'src/app.module';
import { BuildingModule } from '../building/building.module';
import { StorxService } from './services/storx.service';
import { StorXController } from './controllers/storx.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: '$2a$10$4THkK2FfT2Y7AIbU0pBFPOpmKeTfrzs8On2Qe8L362D4DR8VI52gO',
    }),
    MongooseModule.forFeature(deviceFeature),
    MongooseModule.forFeature(deviceLogFeature),
    MongooseModule.forFeature(deviceTypeFeature),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => VirtualMachineModule),
    forwardRef(() => ContractModule),
    forwardRef(() => AppModule),
    forwardRef(() => BuildingModule),
  ],
  providers: [
    DeviceService,
    DeviceRepository,
    DeviceLogService,
    DeviceLogRepository,
    DeviceTypeService,
    DeviceTypeRepository,
    StorxService,
  ],
  controllers: [
    DeviceController,
    DeviceTypeController,
    DeviceLogController,
    StorXController,
  ],
  exports: [DeviceService, DeviceLogService, DeviceTypeService],
})
export class DeviceModule {}
