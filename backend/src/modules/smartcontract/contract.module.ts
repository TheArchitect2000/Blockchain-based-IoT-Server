import { forwardRef, Module } from '@nestjs/common';
import { contractController } from './controller/contract.controller';
import { ContractService } from './services/contract.service';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { ServiceModule } from '../service/service.module';
import { MongooseModule } from '@nestjs/mongoose';
import { contractFeature } from './feature/contract.feature';
import { ContractRepository } from './repository/contract.repository';

@Module({
  imports: [
    MongooseModule.forFeature(contractFeature),
    forwardRef(() => UserModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => ServiceModule),
  ],
  controllers: [contractController],
  providers: [ContractService, ContractRepository],
  exports: [ContractService],
})
export class ContractModule {}
