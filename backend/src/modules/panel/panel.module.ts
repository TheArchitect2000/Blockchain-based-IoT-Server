import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { customerFeature } from './features/customer.feature';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerRepository } from './repositories/customer.repository';
import { homeFeature } from './features/home.feature';
import { HomeController } from './controllers/home.controller';
import { HomeService } from './services/home.service';
import { HomeRepository } from './repositories/home.repository';
import { deviceTypeFeature } from './features/device-type.feature';
import { DeviceTypeController } from './controllers/device-type.controller';
import { DeviceTypeService } from './services/device-type.service';
import { DeviceTypeRepository } from './repositories/device-type.repository';
import { deviceFeature } from './features/device.feature';
import { DeviceController } from './controllers/device.controller';
import { DeviceService } from './services/device.service';
import { DeviceRepository } from './repositories/device.repository';
import { activityFeature } from './features/activity.feature';
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';
import { ActivityRepository } from './repositories/activity.repository';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    /* MongooseModule.forFeature(customerFeature, 'panelDb'),
    MongooseModule.forFeature(homeFeature, 'panelDb'),
    MongooseModule.forFeature(deviceTypeFeature, 'panelDb'),
    MongooseModule.forFeature(deviceFeature, 'panelDb'),
    MongooseModule.forFeature(activityFeature, 'panelDb'), */
    UtilityModule,
  ],
  providers: [
    CustomerService,
    CustomerRepository,
    HomeService,
    HomeRepository,
    DeviceTypeService,
    DeviceTypeRepository,
    DeviceService,
    DeviceRepository,
    ActivityService,
    ActivityRepository,
  ],
  controllers: [
    CustomerController,
    HomeController,
    DeviceTypeController,
    DeviceController,
    ActivityController,
  ],
  exports: [
    CustomerService,
    HomeService,
    DeviceTypeService,
    DeviceService,
    ActivityService,
  ],
})
export class PanelModule {}
