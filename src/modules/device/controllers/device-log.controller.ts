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
  Inject,
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
import { DeviceService } from '../services/device.service';
import storxController from './storx.controller';
import { UserService } from 'src/modules/user/services/user/user.service';

@ApiTags('Manage Device Logs')
@Controller('app')
export class DeviceLogController {
  private result;
  private storxBucket = process.env.STORX_BUCKET_NAME || '';

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly deviceLogService: DeviceLogService,
    private readonly deviceService: DeviceService,
  ) {
    setInterval(async () => {
      const usersRes = await this.userService.getAllUsers();
      const devicesRes = await this.deviceService.getAllDevices();

      devicesRes.map(async (device: any, index) => {
        usersRes.map(async (user) => {
          console.log(
            `User S3 Type: ${typeof user.StorX}, S3 Length: ${
              Object.keys(user.StorX).length
            }, userID: ${user._id}, Device Owner: ${device.userId}`,
          );

          if (
            user._id.toString() === device.userId.toString() &&
            (typeof user.StorX).toString() === 'object' &&
            Number(Object.keys(user.StorX).length) > 0
          ) {
            console.log('User S3 is: ', user.StorX);
            const StorX = user.StorX;
            storxController.setBucketProps(
              StorX.endpoint,
              StorX.access_key_id,
              StorX.secret_key,
            );
            storxController.CreateBucket(this.storxBucket);
            const res =
              await this.getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
                device.deviceEncryptedId,
                'LastDay',
                1,
              );
            const reader = JSON.stringify(res);

            const uploadRes = await storxController.UploadFile({
              reader: reader,
              bucketName: this.storxBucket,
              deviceID: device.deviceEncryptedId,
            });

            console.log('Now bucket is: ', storxController.getStorxBucket());

            if (uploadRes.success == true) {
              console.log(
                `${device.deviceName}, ${device.mac} : have ${res.length} log datas that uploaded successfully`,
              );
            } else {
              console.log(
                `${device.deviceName}, ${device.mac} : log datas can't be uploaded, got errors !`,
              );
            }

            console.log('------------------------------------------------');

            /* const writer = [];
          const startTime = new Date();
          startTime.setDate(startTime.getDate() - 10);
          startTime.setHours(0, 0, 0, 0);
  
          const endTime = new Date();
          endTime.setDate(endTime.getDate() + 1);
          endTime.setHours(23, 59, 59, 0);
  
          const uploadedData = await storxController.DownloadFiles({
            writer: writer,
            bucketName: this.storxBucket,
            deviceID: device.deviceEncryptedId,
            endTime: endTime,
            startTime: startTime,
          }); */
          }
        });
      });
    }, 24 * 60 * 60 * 1000);
  }

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
