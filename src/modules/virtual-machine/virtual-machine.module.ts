import { Module } from '@nestjs/common';
import { ServiceHandlerService } from './services/service-handler.service';
import { ServiceModule } from '../service/service.module';
import { ServiceHandlerController } from './controllers/service-handler.controller';
import { UtilityModule } from '../utility/utility.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, ServiceModule, UtilityModule],
  providers: [ServiceHandlerService],
  controllers: [ServiceHandlerController],
  exports: [ServiceHandlerService],
})
export class VirtualMachineModule {}
