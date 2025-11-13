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
import { insertDeviceDto } from '../data-transfer-objects/device/insert-device.dto';
import { renameDeviceDto } from '../data-transfer-objects/device/rename-device.dto';
import { DeviceService } from '../services/device.service';

@ApiTags('Manage Panel Device')
@Controller('app')
export class DeviceController {
  private result;

  constructor(private readonly deviceService: DeviceService) {}

  /* @Get('v1/panel-device/check-device-is-exists/:deviceMac')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Checks a device existance by mac address.',
    description:
      'Checks a device existance by mac address. This api requires a device mac address.',
  })
  async checkDeviceIsExist(@Param('deviceMac') deviceMac: string) {
    if (deviceMac === null || deviceMac === undefined || deviceMac === '') {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'mac address is required and must be entered.',
      );
    }

    return await this.deviceService.checkDeviceIsExist(deviceMac);
  }

  @Post('v1/panel-device/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'inserts a customer device in the panel.',
    description: 'This api requires customer device profile.',
  })
  async insertCustomer(@Body() body: insertDeviceDto, @Request() request) {
    return await this.deviceService.insertDevice(body);
  }

  @Get('v1/panel-device/get-devices-by-home-id/:homeId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a device by home id.',
    description: 'Gets a device by home id. This api requires a home id.',
  })
  async getDevicesByHomeId(@Param('homeId') homeId: string) {
    if (
      homeId === null ||
      homeId === undefined ||
      homeId === '' ||
      Types.ObjectId.isValid(String(homeId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Home id is required and must be entered and must be entered correctly.',
      );
    }

    await this.deviceService
      .getDevicesByHomeId(homeId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching device profiles!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/panel-device/get-devices-with-encrypted-deviceid-by-home-id/:homeId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a device by home id.',
    description: 'Gets a device by home id. This api requires a home id.',
  })
  async getDevicesWithEncryptedDeviceIdByHomeId(
    @Param('homeId') homeId: string,
  ) {
    if (
      homeId === null ||
      homeId === undefined ||
      homeId === '' ||
      Types.ObjectId.isValid(String(homeId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Home id is required and must be entered and must be entered correctly.',
      );
    }

    await this.deviceService
      .getDevicesWithEncryptedDeviceIdByHomeId(homeId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching devices profiles!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('v1/panel-device/rename-device')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renames device.',
    description: 'Renames device by device ID and new name.',
  })
  async renameDevice(@Body() body: renameDeviceDto, @Request() request) {

    if (
      body.deviceId === null ||
      body.deviceId === undefined ||
      body.deviceId === '' ||
      Types.ObjectId.isValid(String(body.deviceId)) === false
    ) {
      let errorMessage = 'Device id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.deviceService
      .renameDevice(body)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while renaming the device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('v1/panel-device/delete-device-by-device-id/:deviceId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a device with id.' })
  async deleteDeviceByDeviceId(@Param('deviceId') deviceId: string) {
    if (
      deviceId === null ||
      deviceId === undefined ||
      deviceId === '' ||
      Types.ObjectId.isValid(String(deviceId)) === false
    ) {
      let errorMessage = 'Device id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.deviceService
      .deleteDeviceByDeviceId(deviceId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while deleting the device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
