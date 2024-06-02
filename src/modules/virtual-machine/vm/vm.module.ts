import { Module } from '@nestjs/common';
import { VMService } from '../services/vm.service';


@Module({
  providers: [VMService],
  exports: [VMService],
})
export class VMModule {}
