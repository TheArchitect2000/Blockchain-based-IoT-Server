import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';
import { serviceFeature } from './features/service.feature';
import { ServiceRepository } from './repositories/service.repository';
import { InstalledServiceController } from './controllers/installed-service.controller';
import { InstalledServiceService } from './services/installed-service.service';
import { InstalledServiceRepository } from './repositories/installed-service.repository';
import { installedServiceFeature } from './features/installed-service.feature';

@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
  ],
  providers: [
    ServiceService,
    ServiceRepository,
    InstalledServiceService,
    InstalledServiceRepository,
  ],
  controllers: [ServiceController, InstalledServiceController],
  exports: [ServiceService, InstalledServiceService],
})
export class ServiceModule {}
