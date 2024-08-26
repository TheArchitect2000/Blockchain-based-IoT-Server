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
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeletePermissionDto } from '../data-transfer-objects/user-permission/delete-permission.dto';
import { EditPermissionByPanelDto } from '../data-transfer-objects/user-permission/edit-permission-by-panel.dto';
import { InsertPermissionByPanelDto } from '../data-transfer-objects/user-permission/insert-permission-by-panel.dto';
import { UserPermissionService } from '../services/user-permission/user-permission.service';

@ApiTags('Manage User Permissions')
@Controller('')
export class UserPermissionController {
  private result;

  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Post('user-permission')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Define and insert a permission by panel.',
    description:
      'Define and insert a permission by panel. This api requires a permission in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async idefinePermissionByPanel(
    @Body() body: InsertPermissionByPanelDto,
    @Request() request,
  ) {
    await this.userPermissionService
      .insertPermissionByPanel(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while user permission insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('user-permission')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Edit permission by panel.',
    description:
      'Edit permission by panel. This api requires a permission in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editPermissionByPanel(
    @Body() body: EditPermissionByPanelDto,
    @Request() request,
  ) {
    await this.userPermissionService
      .editPermissionByPanel(body, request.user.userId)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while permission update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('user-permission/by-label/:label')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a permission by label.',
    description:
      'Gets a permission by permission label. This api requires a permission label.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAPermissionByLabel(
    @Param('label') label: string,
    @Request() request,
  ) {
    await this.userPermissionService
      .findAPermissionByLabel(label)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('user-permission/by-name/:name')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a permission by name.',
    description:
      'Gets a permission by permission name. This api requires a permission name.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAPermissionByName(@Param('name') name: string, @Request() request) {
    await this.userPermissionService
      .findAPermissionByName(name)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('user-permission/by-module/:module')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get permission by module.',
    description:
      'Gets a permission by permission module. This api requires a permission module.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPermissionByModule(
    @Param('module') module: string,
    @Request() request,
  ) {
    await this.userPermissionService
      .findPermissionByModule(module)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Patch('user-permission/change-activation-status')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Change activation status of a permission with id.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeActivationStatusOfPermission(
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
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.userPermissionService
      .changeActivationStatusOfPermission(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while changing activation status of the permission!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('user-permission')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes a permission with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePermission(
    @Body() body: DeletePermissionDto,
    @Request() request,
  ) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'User info id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.userPermissionService
      .deletePermission(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting the permission!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
