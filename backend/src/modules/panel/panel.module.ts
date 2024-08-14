import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerRepository } from './repositories/customer.repository';
import { HomeController } from './controllers/home.controller';
import { HomeService } from './services/home.service';
import { HomeRepository } from './repositories/home.repository';
import { DeviceTypeController } from './controllers/device-type.controller';
import { DeviceTypeService } from './services/device-type.service';
import { DeviceTypeRepository } from './repositories/device-type.repository';
import { DeviceController } from './controllers/device.controller';
import { DeviceService } from './services/device.service';
import { DeviceRepository } from './repositories/device.repository';
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
