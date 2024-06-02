import { Module } from '@nestjs/common';
import { ServiceHandlerService } from './services/service-handler.service';
import { ServiceModule } from '../service/service.module';
import { ServiceHandlerController } from './controllers/service-handler.controller';
import { UtilityModule } from '../utility/utility.module';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [UserModule, ServiceModule, UtilityModule, DeviceModule],
  providers: [ServiceHandlerService],
  controllers: [ServiceHandlerController],
  exports: [ServiceHandlerService],
})
export class VirtualMachineModule {}
