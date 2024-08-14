import { Module, forwardRef } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { UtilityModule } from '../utility/utility.module';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { BrokerModule } from '../broker/broker.module';
import { VirtualMachineHandlerService } from './services/service-handler.service';
import { ServiceHandlerController } from './controllers/service-handler.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { serviceFeature } from '../service/features/service.feature';
import { installedServiceFeature } from '../service/features/installed-service.feature';


@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    forwardRef(() => BrokerModule),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => ServiceModule),
    UtilityModule,
    DeviceModule,
  ],
  providers: [VirtualMachineHandlerService],
  controllers: [ServiceHandlerController],
  exports: [VirtualMachineHandlerService],
})
export class VirtualMachineModule {}
