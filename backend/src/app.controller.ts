import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserPermissionService } from './modules/user/services/user-permission/user-permission.service';
import { UserRoleService } from './modules/user/services/user-role/user-role.service';
import { UserService } from './modules/user/services/user/user.service';
import { ErrorTypeEnum } from './modules/utility/enums/error-type.enum';
import { GereralException } from './modules/utility/exceptions/general.exception';

@Controller('app')
export class AppController {
  private result;

  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly userPermissionService: UserPermissionService,
    private readonly userRoleService: UserRoleService,
  ) {
    setTimeout(() => {
      this.initializeApplication()
    }, 2000);
  }

  async initializeApplication() {
    await this.userPermissionService
      .insertDefaultPermissions()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while inserting default permissions!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    await this.userRoleService
      .insertDefaultRoles()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while inserting default roles!';
        console.log(error);

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    await this.userService
      .insertDefaultUsers()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while inserting default users!';
        console.log(error);

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
