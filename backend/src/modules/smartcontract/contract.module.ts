import { forwardRef, Module } from '@nestjs/common';
import { contractController } from './controller/contract.controller';
import { ContractService } from './services/contract.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
  ],
  controllers: [contractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
