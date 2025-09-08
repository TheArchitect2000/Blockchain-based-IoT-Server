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
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceLogService } from '../services/device-log.service';
import { DeviceService } from '../services/device.service';
import { UserService } from 'src/modules/user/services/user/user.service';

@ApiTags('Manage Device Logs')
@Controller('app')
export class DeviceLogController {
  private result;
  private storxBucket = process.env.STORX_BUCKET_NAME || '';
  private logKeepDays = Number(process.env.LOG_RETENTION_DAYS ?? '14');

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly deviceLogService: DeviceLogService,
    private readonly deviceService: DeviceService,
  ) {
    setInterval(async () => {
      await this.deviceLogService.removeAllDeviceLogsBeforeDaysAgo(
        this.logKeepDays,
      );

      /* const usersRes = await this.userService.getAllUsers();
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
          // const writer = [];
          //const startTime = new Date();
          //startTime.setDate(startTime.getDate() - 10);
          //startTime.setHours(0, 0, 0, 0);
  
          //const endTime = new Date();
          //endTime.setDate(endTime.getDate() + 1);
          //endTime.setHours(23, 59, 59, 0);
  
          //const uploadedData = await storxController.DownloadFiles({
          //  writer: writer,
          //  bucketName: this.storxBucket,
          //  deviceID: device.deviceEncryptedId,
          //  endTime: endTime,
          //  startTime: startTime,
          //});
          }
        });
      }); */
    }, 24 * 60 * 60 * 1000);
  }

  async isAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      (profile?.roles.some((role) => role.name === 'super_admin') == false &&
        profile?.roles.some((role) => role.name === 'device_admin') == false)
    ) {
      return false;
    } else {
      return true;
    }
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
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceLogService
      .getDeviceLogByEncryptedDeviceIdAndFieldName(
        deviceEncryptedId,
        fieldName,
        request.user.userId,
        isAdmin,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.log(error);

        let errorMessage =
          'Some errors occurred while fetching last device log!';

        throw new GeneralException(
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
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    await this.deviceLogService
      .getLastDevicesLogByUserIdAndFieldName(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching last devices log!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/device-log/get-last-my-local-devices-log-by-field-name')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets last devices log by user id and field name.',
    description:
      "This api requires an user id and field name. (Default field name is 'data')",
  })
  @ApiQuery({
    name: 'fieldName',
    type: String,
    required: true,
    description: 'Field Name',
  })
  async getLastMyLocalDevicesLogByUserIdAndFieldName(
    @Query('fieldName') fieldName: string,
    @Request() request,
  ) {
    const userId = request.user.userId;

    await this.deviceLogService
      .getLastLocalDevicesLogByUserIdAndFieldName(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching last local devices log!';

        throw new GeneralException(
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
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceLogService
      .getDeviceLogByEncryptedDeviceIdAndFieldNameAndDate(
        deviceEncryptedId,
        startYear,
        startMonth,
        startDay,
        endYear,
        endMonth,
        endDay,
        request.user.userId,
        isAdmin,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching devices logs!';

        throw new GeneralException(
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
    name: 'daysBefore',
    type: Number,
    required: true,
    description: 'Number of days before',
  })
  async getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('daysBefore') daysBefore: number,
    @Request() request?,
  ) {
    const isSharedWithUser =
      await this.deviceService.isDeviceEncryptedSharedWithUser(
        deviceEncryptedId,
        request.user.userId,
      );

    const isAdmin = await this.isAdmin(request.user.userId);
    // if storX saving is not working check this section
    if (request) {
      await this.deviceLogService
        .getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
          deviceEncryptedId,
          daysBefore,
          request.user.userId,
          (isSharedWithUser == true && true) || isAdmin,
        )
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while fetching devices logs!';

          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      await this.deviceLogService
        .getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
          deviceEncryptedId,
          daysBefore,
        )
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while fetching devices logs!';

          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  @Get('v1/device-log/get-device-log-by-encrypted-deviceid-and-date-range')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets device activity by encrypted device ID and date range.',
    description:
      'This API requires a device ID, date range, and type (day/hour) and returns aggregated device logs for the specified period.',
  })
  @ApiQuery({
    name: 'deviceEncryptedId',
    type: String,
    required: true,
    description: 'Device encrypted ID',
  })
  @ApiQuery({
    name: 'startDate',
    type: Date,
    required: true,
    description: 'Start date of the range (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: true,
    description: 'End date of the range (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'type',
    enum: ['day', 'hour'],
    required: true,
    description: 'Type of aggregation (day or hour)',
  })
  async getDeviceLogByEncryptedDeviceIdAndDateRange(
    @Query('deviceEncryptedId') deviceEncryptedId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('type') type: 'day' | 'hour',
    @Request() request?,
  ) {
    // Check if the device is shared with the user
    const isSharedWithUser =
      await this.deviceService.isDeviceEncryptedSharedWithUser(
        deviceEncryptedId,
        request.user.userId,
      );

    // Check if the user is an admin
    const isAdmin = await this.isAdmin(request.user.userId);

    try {
      const result =
        await this.deviceLogService.getDeviceLogByEncryptedDeviceIdAndDateRange(
          deviceEncryptedId,
          new Date(startDate),
          new Date(endDate),
          type,
          request.user.userId,
          isSharedWithUser || isAdmin,
        );

      return result;
    } catch (error) {
      const errorMessage = 'Some errors occurred while fetching device logs!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
  }
}
