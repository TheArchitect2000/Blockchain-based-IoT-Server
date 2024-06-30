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
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
// import { DeleteGeneralDto } from 'src/modules/utility/data-transfer-objects/delete-general.dto';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { Types } from 'mongoose';
import { insertTagByPanelDto } from '../data-transfer-objects/tag/insert-tag-by-panel.dto';
import { updateTagByPanelDto } from '../data-transfer-objects/tag/update-tag-by-panel.dto';
import { TagService } from '../services/tag.service';
// import { EditTagByPanelDto } from '../data-transfer-objects/tag/edit-tag-by-panel.dto';
// import { EditTagByUserDto } from '../data-transfer-objects/tag/edit-tag-by-user.dto';
// import { InsertTagByUserDto } from '../data-transfer-objects/tag/insert-tag-by-user.dto';
// import { SortModeEnum } from '../enums/sort-mode.enum';
// import { ActivationStatusEnum } from '../enums/activation-status.enum';
// import { VerificationStatusEnum } from '../enums/verification-status.enum';
// import { BooleanEnum } from '../enums/boolean.enum';
import { changeActivationStatusDto } from '../data-transfer-objects/tag/change-activation-status.dto';
import { changeVerificationStatusDto } from '../data-transfer-objects/tag/change-verification-status.dto';
// import { ChangeVerificationStatusGeneralDto } from '../data-transfer-objects/change-verification-status-general.dto';
import { deleteTagDto } from '../data-transfer-objects/tag/delete-tag-dto';
import { ActivationStatusEnum } from '../enums/activation-status.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

@ApiTags('Manage Tags')
@Controller('')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('tag/insert')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Insert a tag .',
    description: 'Insert a tag . This api requires a tag in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async insertDefaultUserByPanel(
    @Body() body: insertTagByPanelDto,
    @Request() request,
  ) {
    return await this.tagService.insertTagByPanel(body, request.user.userId);
  }

  @Patch('tag/update/:tagId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Insert a tag by user.',
    description:
      'Insert a tag by user. This api requires a tag in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateTagByPanel(
    @Param('tagId') tagId: string,
    @Body() body: updateTagByPanelDto,
    @Request() request,
  ) {
    if (
      tagId === null ||
      tagId === undefined ||
      tagId === '' ||
      Types.ObjectId.isValid(String(tagId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagId is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.updateTagByPanel(body, request.user.userId);
  }

  @Patch('tag/change-activation-status/:tagId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change activation status of a user with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeActivationStatusOfUser(
    @Param('tagId') tagId: string,
    @Body() body: changeActivationStatusDto,
    @Request() request,
  ) {
    if (
      tagId === null ||
      tagId === undefined ||
      tagId === '' ||
      Types.ObjectId.isValid(String(tagId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagId is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.changeActivationStatus(
      body,
      tagId,
      request.user.userId,
    );
  }

  @Patch('tag/change-verification-status/:tagId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change verification status of a tag with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeVerificationStatusOfUser(
    @Param('tagId') tagId: string,
    @Body() body: changeVerificationStatusDto,
    @Request() request,
  ) {
    if (
      tagId === null ||
      tagId === undefined ||
      tagId === '' ||
      Types.ObjectId.isValid(String(tagId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagId is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.changeVerificationStatus(
      body,
      tagId,
      request.user.userId,
    );
  }

  @Get('v1/tag/get-by-id/:tagId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a tag by id.',
    description: 'Gets a tag by content id. This api requires a tag id.',
  })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async getAnContentById(@Param('tagId') tagId: string, @Request() request) {
    if (
      tagId === null ||
      tagId === undefined ||
      tagId === '' ||
      Types.ObjectId.isValid(String(tagId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagId id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.findTagById(tagId);
  }

  @Get('v1/tag/get-by-name/:tagName')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a tag by tagName.',
    description: 'Get a tag by tagName. This api requires a tag id.',
  })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async getAnContentByName(
    @Param('tagName') tagName: string,
    @Request() request,
  ) {
    if (tagName === null || tagName === undefined || tagName === '') {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagName is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.findTagByName(tagName);
  }

  @Delete('tag/delete/:tagId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes a tag with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteContent(
    @Param('tagId') tagId: string,
    @Body() body: deleteTagDto,
    @Request() request,
  ) {
    if (
      tagId === null ||
      tagId === undefined ||
      tagId === '' ||
      Types.ObjectId.isValid(String(tagId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'tagId id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.tagService.deleteTag(body, tagId, request.user.userId);
  }

  @Get('v1/tag/search')
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'Gets a user by user id. This api requires a user id.',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: false,
    description: 'Number of Page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit item in each page ',
  })
  @ApiQuery({
    name: 'sortMode',
    type: String,
    required: false,
    description: 'sortMode of all advertising',
  })
  @ApiQuery({
    name: 'searchText',
    type: String,
    required: false,
    description: 'Each text you want to search',
  })
  async searchTagsByUser(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
    @Query('sortMode') sortMode: string,
    @Query('searchText') searchText: string,
    @Request() request,
  ) {
    pageNumber = pageNumber ? pageNumber : 1;
    limit = limit ? limit : 20;
    sortMode = sortMode ? sortMode : 'desc';
    searchText = searchText ? searchText : '';

    return await this.tagService.searchInTagsByUser(
      pageNumber,
      limit,
      sortMode,
      searchText,
      request.user.userId,
    );
  }

  @Get('tag/search')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'Gets a user by user id. This api requires a user id.',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: false,
    description: 'Number of Page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit item in each page ',
  })
  @ApiQuery({
    name: 'sortMode',
    type: String,
    required: false,
    description: 'sortMode of all advertising',
  })
  @ApiQuery({
    name: 'searchText',
    type: String,
    required: false,
    description: 'Each text you want to search',
  })
  @ApiQuery({
    name: 'fromDate',
    type: String,
    required: false,
    description: 'From Date',
  })
  @ApiQuery({
    name: 'toDate',
    type: String,
    required: false,
    description: 'To Date',
  })
  @ApiQuery({
    name: 'activation',
    type: String,
    required: false,
    enum: ActivationStatusEnum,
    enumName: 'activation',
    description: 'Activation status of users',
  })
  @ApiQuery({
    name: 'verification',
    type: String,
    required: false,
    enum: VerificationStatusEnum,
    enumName: 'verification',
    description: 'Verification status of users',
  })
  async searchTagsByPanel(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
    @Query('sortMode') sortMode: string,
    @Query('searchText') searchText: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    // @Query('users') users: any,
    @Query('activation') activation: string,
    @Query('verification') verification: string,
    @Request() request,
  ) {
    pageNumber = pageNumber ? pageNumber : 1;
    limit = limit ? limit : 20;
    sortMode = sortMode ? sortMode : 'desc';
    searchText = searchText ? searchText : '';
    activation = activation ? activation : '';
    verification = verification ? verification : '';
    fromDate = fromDate ? fromDate : '';
    toDate = toDate ? toDate : '';

    fromDate = fromDate
      ? new Date(fromDate).toISOString()
      : new Date('2019/01/01').toISOString();
    toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();

    if (fromDate > toDate) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Start date cant be grater than end date .',
      );
    }

    return await this.tagService.searchInTagsByPanel(
      pageNumber,
      limit,
      sortMode,
      searchText,
      activation,
      verification,
      fromDate,
      toDate,
      request.user.userId,
    );
  }
}
