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
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeleteUserInfoDto } from '../data-transfer-objects/user-info/delete-user-info.dto';
import { EditUserInfoProfileByPanelDto } from '../data-transfer-objects/user-info/edit-user-info-profile-by-panel.dto';
import { EditUserInfoProfileByUserDto } from '../data-transfer-objects/user-info/edit-user-info-profile-by-user.dto';
import { InsertUserInfoByPanelDto } from '../data-transfer-objects/user-info/insert-user-info-by-panel.dto';
import { InsertUserInfoByUserDto } from '../data-transfer-objects/user-info/insert-user-info-by-user.dto';
import { UserInfoService } from '../services/user-info/user-info.service';

@ApiTags('Manage User Infos')
@Controller('')
export class UserInfoController {
  private result;

  constructor(private readonly userInfoService: UserInfoService) {}

  @Post('v1/user-info')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Insert a user info by user.',
    description:
      'Insert a user info by user. This api requires a user info in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async insertUserByUser(
    @Body() body: InsertUserInfoByUserDto,
    @Request() request,
  ) {
    await this.userInfoService
      .insertUserInfoByUser(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user info insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Post('user-info')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Insert a user info by panel.',
    description:
      'Insert a user info by panel. This api requires a user info in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async insertUserInfoByPanel(
    @Body() body: InsertUserInfoByPanelDto,
    @Request() request,
  ) {
    await this.userInfoService
      .insertUserInfoByPanel(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user info insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('v1/user-info')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Edit user profile by user.',
    description:
      'Edit user info by user. This api requires a user info profile in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editUserInfoByUser(
    @Body() body: EditUserInfoProfileByUserDto,
    @Request() request,
  ) {
    await this.userInfoService
      .editUserInfoByUser(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user info insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('user-info')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Edit user info by panel.',
    description:
      'Edit user info by panel. This api requires a user info in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editUserInfoByPanel(
    @Body() body: EditUserInfoProfileByPanelDto,
    @Request() request,
  ) {
    await this.userInfoService
      .editUserByPanel(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user info insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('user-info')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes a user info with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteUserInfo(@Body() body: DeleteUserInfoDto, @Request() request) {
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

    await this.userInfoService
      .deleteUserInfo(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while deleting the user info!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
