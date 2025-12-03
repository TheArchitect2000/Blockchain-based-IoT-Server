import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserModule } from '../user/user.module';
import { BuildingModule } from '../building/building.module';

@Module({
  imports: [UserModule, BuildingModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

