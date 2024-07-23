import { Module } from '@nestjs/common';
import { zkpController } from './controller/zkp.controller';
import { ZkpService } from './services/zkp.service';

@Module({
  controllers: [zkpController],
  providers: [ZkpService],
  exports: [ZkpService],
})
export class ZkpModule {}
