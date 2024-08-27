import { forwardRef, Module } from '@nestjs/common';
import { contractController } from './controller/contract.controller';
import { ContractService } from './services/contract.service';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => ServiceModule),
  ],
  controllers: [contractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
