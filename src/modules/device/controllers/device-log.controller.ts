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
import { DeviceLogService } from '../services/device-log.service';

@ApiTags('Manage Device Logs')
@Controller('app')
export class DeviceLogController {
  private result;

  constructor(private readonly deviceLogService: DeviceLogService) {}

  @Get('v1/device-log/get-last-device-log-by-encrypted-deviceid-and-field-name')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets last device log by encrypted device id and field name.',
    description:
      "This api requires an encrypted device id and field name. (Default field name is 'data')",
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
  async getLastDeviceLogByEncryptedDeviceIdAndFieldName(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('fieldName') fieldName: string,
  ) {
    await this.deviceLogService
      .getDeviceLogByEncryptedDeviceIdAndFieldName(deviceEncryptedId, fieldName)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching last device log!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/device-log/get-last-devices-log-by-userid-and-field-name')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets last devices log by user id and field name.',
    description:
      "This api requires an user id and field name. (Default field name is 'data')",
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: 'user ID',
  })
  @ApiQuery({
    name: 'fieldName',
    type: String,
    required: true,
    description: 'Field Name',
  })
  async getLastDevicesLogByUserIdAndFieldName(
    @Query('userId') userId: string,
    @Query('fieldName') fieldName: string,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly.',
      );
    }

    await this.deviceLogService
      .getLastDevicesLogByUserIdAndFieldName(userId, fieldName)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching last devices log!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get(
    'v1/device-log/get-device-log-by-encrypted-deviceid-and-field-name-and-date',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets device activity by encrypted deviceid and field name.',
    description:
      'This api requires a deviceid and field name and returns device logs in this days.',
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
  async getDeviceLogByEncryptedDeviceIdAndFieldNameAndDate(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('fieldName') fieldName: string,
    @Query('startYear') startYear: number,
    @Query('startMonth') startMonth: number,
    @Query('startDay') startDay: number,
    @Query('endYear') endYear: number,
    @Query('endMonth') endMonth: number,
    @Query('endDay') endDay: number,
  ) {
    await this.deviceLogService
      .getDeviceLogByEncryptedDeviceIdAndFieldNameAndDate(
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
        let errorMessage = 'Some errors occurred while fetching devices logs!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get(
    'v1/device-log/get-device-log-by-encrypted-deviceid-and-field-name-and-number-of-days-before',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets device activity by encrypted deviceid and field name and number of days ago.',
    description:
      'This api requires a deviceid and field name and number of days before and returns device logs in recent days.',
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
    name: 'daysBefore',
    type: Number,
    required: true,
    description: 'Number of days before',
  })
  async getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('fieldName') fieldName: string,
    @Query('daysBefore') daysBefore: number,
  ) {
    await this.deviceLogService
      .getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
        deviceEncryptedId,
        fieldName,
        daysBefore,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching devices logs!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
