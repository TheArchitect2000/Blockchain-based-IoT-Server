import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Patch,
  Delete,
  Request,
  Response,
  UseGuards,
  Param,
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { ChangeActivationStatusGeneralDto } from 'src/modules/utility/data-transfer-objects/change-activation-status-general.dto';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { DeleteRoleDto } from '../data-transfer-objects/user-role/delete-role.dto';
import { EditRoleByPanelDto } from '../data-transfer-objects/user-role/edit-role-by-panel.dto';
import { InsertRoleByPanelDto } from '../data-transfer-objects/user-role/insert-role-by-panel.dto';
import { UserRoleService } from '../services/user-role/user-role.service';

@ApiTags('Manage User Roles')
@Controller('')
export class UserRoleController {
  private result;

  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('user-role')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Define and insert a role by panel.',
    description:
      'Define and insert a role by panel. This api requires a role in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async defineRoleByPanel(
    @Body() body: InsertRoleByPanelDto,
    @Request() request,
  ) {
    await this.userRoleService
      .insertRoleByPanel(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user role insertion!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('user-role')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Edit user role by panel.',
    description:
      'Edit user role by panel. This api requires a role in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editRoleByPanel(@Body() body: EditRoleByPanelDto, @Request() request) {
    await this.userRoleService
      .editRoleByPanel(body, request.user.userId)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while role update!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('user-role/by-name/:name')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a role by name.',
    description: 'Gets a role by role name. This api requires a role name.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getARoleByName(@Param('name') name: string, @Request() request) {
    await this.userRoleService
      .findARoleByName(name)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('user-role/by-label/:label')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a user role by label.',
    description: 'Gets a role by role label. This api requires a role label.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getARoleByLabel(@Param('label') label: string, @Request() request) {
    await this.userRoleService
      .findARoleByLabel(label)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('user-role/by-department/:department')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a role by department.',
    description:
      'Gets a role by role department. This api requires a role department.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRoleByDepartment(
    @Param('department') department: string,
    @Request() request,
  ) {
    await this.userRoleService
      .findRoleByDepartment(department)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Patch('user-role/change-activation-status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change activation status of a role with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeActivationStatusOfRole(
    @Body() body: ChangeActivationStatusGeneralDto,
    @Request() request,
  ) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'User id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.userRoleService
      .changeActivationStatusOfRole(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while changing activation status of the role!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('user-role')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes a role with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteRole(@Body() body: DeleteRoleDto, @Request() request) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'User info id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.userRoleService
      .deleteRole(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while deleting the role!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
