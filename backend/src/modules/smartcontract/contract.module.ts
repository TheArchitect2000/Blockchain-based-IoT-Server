import { Module, forwardRef } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { DeviceModule } from '../device/device.module';
import { ServiceModule } from '../service/service.module';
import { ContractDataService } from './contract-data';
import { contractController } from './controller/contract.controller';
import { ContractRepository } from './repository/contract.repository';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { contractFeature } from './feature/contract.feature';

@Module({
  imports: [
    MongooseModule.forFeature(contractFeature),
    forwardRef(() => UserModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => ServiceModule),
  ],
  controllers: [contractController],
  providers: [ContractService, ContractRepository, ContractDataService],
  exports: [ContractService],
})
export class ContractModule {}
