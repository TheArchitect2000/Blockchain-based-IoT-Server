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
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { Types } from 'mongoose';
import { DeleteGeneralDto } from 'src/modules/utility/data-transfer-objects/delete-general.dto';
import { CategoryService } from '../services/category.service';
import { insertCategoryByPanelDto } from '../data-transfer-objects/category/insert-category-by-panel.dto';
import { EditCategoryByPanelDto } from '../data-transfer-objects/category/edit-category-by-panel.dto';
import { ActivationStatusEnum } from '../enums/activation-status.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';
import { BooleanEnum } from '../enums/boolean.enum';
import { SortModeEnum } from '../enums/sort-mode.enum';
import { ChangeActivationStatusGeneralDto } from '../data-transfer-objects/change-activation-status-general.dto';
import { ChangeVerificationStatusGeneralDto } from '../data-transfer-objects/change-verification-status-general.dto';

@ApiTags('Manage Categories')
@Controller('')
export class CategoryController {
  private result;

  constructor(private readonly categoryService: CategoryService) {}

  @Post('category')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Insert a content .',
    description:
      'Insert a content . This api requires a content in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async insertContentCategoryByPanel(
    @Body() body: insertCategoryByPanelDto,
    @Request() request,
  ) {
    if (body.parent) {
      if (
        body.parent === null ||
        body.parent === undefined ||
        body.parent === '' ||
        Types.ObjectId.isValid(String(body.parent)) === false
      ) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'parent is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    if (body.image) {
      if (
        body.image === null ||
        body.image === undefined ||
        body.image === '' ||
        Types.ObjectId.isValid(String(body.image)) === false
      ) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'image is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    return await this.categoryService.insertCategoryByPanel(
      body,
      request.user.userId,
    );
  }

  @Patch('category')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Edit content category by panel.',
    description:
      'Edit content category by panel. This api requires a content category in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editCategoryByPanel(
    @Body() body: EditCategoryByPanelDto,
    @Request() request,
  ) {
    await this.categoryService
      .editCategoryByPanel(body, request.user.userId)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while content insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('category/change-activation-status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change activation status of a category with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeActivationStatusOfCategory(
    @Body() body: ChangeActivationStatusGeneralDto,
    @Request() request,
  ) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'Category id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.categoryService
      .changeActivationStatusOfCategory(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while changing activation status of the category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('category/change-verification-status')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Change verification status of a category with id.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeVerificationStatusOfCategory(
    @Body() body: ChangeVerificationStatusGeneralDto,
    @Request() request,
  ) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'Category id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.categoryService
      .changeVerificationStatusOfCategory(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while changing verification status of the category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('category/by-id/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a content by id.',
    description:
      'Gets a content by content id. This api requires a content category id.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAnContentById(@Param('id') id: string, @Request() request) {
    console.log('We are here1!');
    if (
      id === null ||
      id === undefined ||
      id === '' ||
      Types.ObjectId.isValid(String(id)) === false
    ) {
      let errorMessage =
        'Category id is required and must be entered and must be entered correctly with objectId type.';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    await this.categoryService
      .findACategoryById(id)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('category/by-name/:name')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a content category by name.',
    description:
      'Gets a content category by content category name. This api requires a content category name.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAnContentCategoryByName(
    @Param('name') name: string,
    @Request() request,
  ) {
    if (name === null || name === undefined || name === '') {
      let errorMessage = 'Content title required and must be entered.';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    await this.categoryService
      .findACategoryByName(name)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  @Get('category/search')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Search categories.',
    description: 'Search categories. This api searches categories.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    description: 'Limits item in each page ',
  })
  @ApiQuery({
    name: 'sortMode',
    type: String,
    required: false,
    enum: SortModeEnum,
    enumName: 'SortMode',
    description: 'sortMode of all categories.',
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
    name: 'activationStatus',
    type: String,
    required: false,
    enum: ActivationStatusEnum,
    enumName: 'ActivationStatus',
    description: 'Activation Status of category',
  })
  @ApiQuery({
    name: 'verificationStatus',
    type: String,
    required: false,
    enum: VerificationStatusEnum,
    enumName: 'VerificationStatus',
    description: 'Verification Status of category',
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    enum: BooleanEnum,
    enumName: 'isDeleted',
    description: 'Check if categories are deleted.',
  })
  async searchCategories(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
    @Query('sortMode') sortMode: string,
    @Query('searchText') searchText: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('activationStatus') activationStatus: string,
    @Query('verificationStatus') verificationStatus: string,
    @Query('isDeleted') isDeleted: boolean,
    @Request() request,
  ) {
    console.log('We are here2!');

    pageNumber = pageNumber ? pageNumber : 1;
    limit = limit ? limit : 20;
    sortMode = sortMode ? sortMode : 'DESC'; // ASC/DESC OR 1/-1
    searchText = searchText ? searchText : '';
    activationStatus = activationStatus ? activationStatus : '';
    verificationStatus = verificationStatus ? verificationStatus : '';
    isDeleted = isDeleted ? isDeleted : false;
    fromDate = fromDate
      ? new Date(fromDate).toISOString()
      : new Date('2019/01/01').toISOString();
    toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();

    if (fromDate > toDate) {
      let errorMessage = 'fromDate must be lower than toDate!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.categoryService
      .searchCategories(
        pageNumber,
        limit,
        sortMode,
        searchText,
        activationStatus,
        verificationStatus,
        isDeleted,
        fromDate,
        toDate,
        request.user.userId,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while search in categories!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('category')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes a category with id.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteCategory(@Body() body: DeleteGeneralDto, @Request() request) {
    if (
      body._id === null ||
      body._id === undefined ||
      body._id === '' ||
      Types.ObjectId.isValid(String(body._id)) === false
    ) {
      let errorMessage = 'Content id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.categoryService
      .deleteContentCategory(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting the content category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
