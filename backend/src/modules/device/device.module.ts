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

@Module({
  imports: [
    MongooseModule.forFeature(deviceFeature),
    MongooseModule.forFeature(deviceLogFeature),
    MongooseModule.forFeature(deviceTypeFeature),
    forwardRef(() => UserModule),

  ],
  providers: [
    DeviceService,
    DeviceRepository,
    DeviceLogService,
    DeviceLogRepository,
    DeviceTypeService,
    DeviceTypeRepository,
  ],
  controllers: [DeviceController, DeviceTypeController, DeviceLogController],
  exports: [DeviceService, DeviceLogService, DeviceTypeService],
})
export class DeviceModule {}
