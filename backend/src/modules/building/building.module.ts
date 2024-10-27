import { forwardRef, Module } from '@nestjs/common';
import { BuildingController } from './buildings/building.controller';
import { BuildingService } from './buildings/building.service';
import { MongooseModule } from '@nestjs/mongoose';
import { buildingFeature } from './buildings/building.feature';
import { UtilityModule } from '../utility/utility.module';
import { BuildingRepository } from './buildings/building.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature(buildingFeature),
    forwardRef(() => UserModule),
    forwardRef(() => UtilityModule),
  ],
  controllers: [BuildingController],
  providers: [BuildingService, BuildingRepository],
  exports: [BuildingService],
})
export class BuildingModule {}