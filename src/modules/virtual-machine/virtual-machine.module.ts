// src/modules/virtual-machine/virtual-machine.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ServiceHandlerService } from './services/service-handler.service';
import { ServiceModule } from '../service/service.module';
import { ServiceHandlerController } from './controllers/service-handler.controller';
import { UtilityModule } from '../utility/utility.module';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { VMService } from './services/vm.service';
import { VirtualMachineServer } from './server/virtual-machine-server';
import { InstalledServiceService } from '../service/services/installed-service.service';
import { DeviceService } from '../device/services/device.service';
import { UserService } from '../user/services/user/user.service';
import { MailService } from '../utility/services/mail.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
    UtilityModule,
    forwardRef(() => DeviceModule)
  ],
  providers: [
    ServiceHandlerService,
    VMService,
    VirtualMachineServer,
    InstalledServiceService,
    DeviceService,
    UserService,
    MailService,
  ],
  controllers: [ServiceHandlerController],
  exports: [ServiceHandlerService, VMService, VirtualMachineServer],
})
export class VirtualMachineModule {}
