import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserPermissionService } from './modules/user/services/user-permission/user-permission.service';
import { UserRoleService } from './modules/user/services/user-role/user-role.service';
import { UserService } from './modules/user/services/user/user.service';
import { ErrorTypeEnum } from './modules/utility/enums/error-type.enum';
import { GereralException } from './modules/utility/exceptions/general.exception';
import { JwtAuthGuard } from './modules/authentication/guard/jwt-auth.guard';

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

    return this.result;
  }

  @Get('/v1/theme')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get mobile them colors.',
    description: '',
  })
  async getThemeColors() {
    return {
      "logo": process.env.THEME_LOGO,
      "text": process.env.THEME_TEXT,
      "background": process.env.THEME_BACKGROUND,
      "box": process.env.THEME_BOX,
      "button": process.env.THEME_BUTTON,
    }
  }

}
