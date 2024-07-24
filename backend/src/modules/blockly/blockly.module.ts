import { Module } from '@nestjs/common';
import { BlocklyService } from './services/blockly.service';

@Module({
  providers: [BlocklyService],
})
export class BlocklyModule {}
