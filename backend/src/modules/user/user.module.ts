import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { otpFeature } from '../utility/features/otp.feature';
import { UtilityModule } from '../utility/utility.module';
import { UserController } from './controllers/user.controller';
import { userInfoFeature } from './features/user-info.feature';
import { userPermissionFeature } from './features/user-permission.feature';
import { userRoleFeature } from './features/user-role.feature';
import { userFeature } from './features/user.feature';
import { UserInfoRepository } from './repositories/user-info.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { UserRepository } from './repositories/user.repository';
import { UserInfoService } from './services/user-info/user-info.service';
import { UserPermissionService } from './services/user-permission/user-permission.service';
import { UserRoleService } from './services/user-role/user-role.service';
import { UserService } from './services/user/user.service';
import { MulterConfigService } from '../utility/services/multer-configuration.service';
import { JwtModule } from '@nestjs/jwt';
import { PanelModule } from '../panel/panel.module';
import { DeviceModule } from '../device/device.module';
import { ServiceModule } from '../service/service.module';
import { VirtualMachineModule } from '../virtual-machine/virtual-machine.module';

@Module({
  imports: [
    MongooseModule.forFeature(userFeature),
    MongooseModule.forFeature(userInfoFeature),
    MongooseModule.forFeature(userRoleFeature),
    MongooseModule.forFeature(userPermissionFeature),
    MongooseModule.forFeature(otpFeature),
    forwardRef(() => VirtualMachineModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => DeviceModule),
    UtilityModule,
    PanelModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '120m' },
    }),
  ],
  providers: [
    UserService,
    UserRepository,
    UserInfoService,
    UserInfoRepository,
    UserRoleService,
    UserRoleRepository,
    UserPermissionService,
    UserPermissionRepository,
  ],
  controllers: [
    UserController,
    // UserInfoController,
    // UserRoleController,
    // UserPermissionController
  ],
  exports: [UserService, UserPermissionService, UserRoleService],
})
export class UserModule {}
