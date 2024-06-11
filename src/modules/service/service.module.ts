import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';
import { serviceFeature } from './features/service.feature';
import { ServiceRepository } from './repositories/service.repository';
import { InstalledServiceController } from './controllers/installed-service.controller';
import { InstalledServiceService } from './services/installed-service.service';
import { InstalledServiceRepository } from './repositories/installed-service.repository';
import { installedServiceFeature } from './features/installed-service.feature';
import { MailService } from '../utility/services/mail.service';
import { UserService } from '../user/services/user/user.service';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    MongooseModule.forFeature(serviceFeature),
    MongooseModule.forFeature(installedServiceFeature),
    forwardRef(() => UserModule),
    forwardRef(() => DeviceModule)
  ],
  providers: [
    ServiceService,
    ServiceRepository,
    InstalledServiceService,
    MailService,
    InstalledServiceRepository,
  ],
  controllers: [ServiceController, InstalledServiceController],
  exports: [ServiceService, InstalledServiceService, MailService],
})
export class ServiceModule {}
