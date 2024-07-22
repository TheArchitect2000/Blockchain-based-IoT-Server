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
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { insertDeviceDto } from '../data-transfer-objects/device/insert-device.dto';
import { ActivityService } from '../services/activity.service';

@ApiTags('Manage Panel Activity')
@Controller('app')
export class ActivityController {
  private result;

  constructor(private readonly activityService: ActivityService) {}

  /* @Get(
    'v1/panel-activity/get-device-activity-by-encrypted-deviceid-and-field-name',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets device activity by encrypted deviceid and field name.',
    description: 'This api requires a deviceid and field name.',
  })
  @ApiQuery({
    name: 'deviceEncryptedId',
    type: String,
    required: true,
    description: 'device encrypted ID',
  })
  @ApiQuery({
    name: 'fieldName',
    type: String,
    required: true,
    description: 'Field Name',
  })
  async getDeviceActivityByEncryptedDeviceIdAndFieldName(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('fieldName') fieldName: string,
  ) {
    await this.activityService
      .getDeviceActivityByEncryptedDeviceIdAndFieldName(
        deviceEncryptedId,
        fieldName,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching devices activities!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get(
    'v1/panel-activity/get-device-activity-by-encrypted-deviceid-and-field-name-and-date',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets device activity by encrypted deviceid and field name.',
    description: 'This api requires a deviceid andfield name.',
  })
  @ApiQuery({
    name: 'deviceEncryptedId',
    type: String,
    required: true,
    description: 'device encrypted ID',
  })
  @ApiQuery({
    name: 'fieldName',
    type: String,
    required: true,
    description: 'Field Name',
  })
  @ApiQuery({
    name: 'startYear',
    type: Number,
    required: true,
    description: 'Start year',
  })
  @ApiQuery({
    name: 'startMonth',
    type: Number,
    required: true,
    description: 'Start Month',
  })
  @ApiQuery({
    name: 'startDay',
    type: Number,
    required: true,
    description: 'Start Day',
  })
  @ApiQuery({
    name: 'endYear',
    type: Number,
    required: true,
    description: 'End year',
  })
  @ApiQuery({
    name: 'endMonth',
    type: Number,
    required: true,
    description: 'End month',
  })
  @ApiQuery({
    name: 'endDay',
    type: Number,
    required: true,
    description: 'End day',
  })
  async getDeviceActivityByEncryptedDeviceIdAndFieldNameAndDate(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('fieldName') fieldName: string,
    @Query('startYear') startYear: number,
    @Query('startMonth') startMonth: number,
    @Query('startDay') startDay: number,
    @Query('endYear') endYear: number,
    @Query('endMonth') endMonth: number,
    @Query('endDay') endDay: number,
  ) {
    await this.activityService
      .getDeviceActivityByEncryptedDeviceIdAndFieldNameAndDate(
        deviceEncryptedId,
        fieldName,
        startYear,
        startMonth,
        startDay,
        endYear,
        endMonth,
        endDay,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching devices activities!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
