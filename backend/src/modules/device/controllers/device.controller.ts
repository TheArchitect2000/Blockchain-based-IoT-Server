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
import { insertDeviceDto } from '../data-transfer-objects/insert-device.dto';
import { renameDeviceDto } from '../data-transfer-objects/rename-device.dto';
import { DeviceService } from '../services/device.service';
import { EditDeviceDto } from '../data-transfer-objects/edit-device.dto';
import { UserService } from 'src/modules/user/services/user/user.service';
import { LocalShareDto } from '../data-transfer-objects/local-share-dto';
import { GlobalShareDto } from '../data-transfer-objects/global-share-dto';

@ApiTags('Manage Devices')
@Controller('app')
export class DeviceController {
  private result;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService?: UserService,
  ) {}

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

  @Get('v1/device/check-device-is-exists/:deviceMac')
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

  @Post('v1/device/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'inserts a user device.',
    description:
      'This api requires user device profile. Parameters are array of JSON objects like: [{"a1":"v1"},{"a2":"v2"},...], Locations and Geometries are like: "location": {"type":"Point","coordinates": [50,40]}, "geometry": {"type":"Polygon","coordinates": [[50,40],[20,10],[30,60]]}  for default set to "location": {}, "geometry": {}',
  })
  async insertDevice(@Body() body: insertDeviceDto, @Request() request) {
    const newBody = {
      ...body,
      userId: request.user.userId,
      nodeId: process.env.NODE_NAME,
    };
    return await this.deviceService.insertDevice(newBody);
  }

  @Patch('v1/device/edit')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edites devices.',
    description:
      'Edites device by device ID and other fields. This api requires user device profile. Parameters are array of JSON objects like: [{"a1":"v1"},{"a2":"v2"},...], Locations and Geometries are like: "location": {"type":"Point","coordinates": [50,40]}, "geometry": {"type":"Polygon","coordinates": [[50,40],[20,10],[30,60]]}  for default set to "location": {}, "geometry": {}',
  })
  async editDevice(@Body() body: EditDeviceDto, @Request() request) {
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

    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceService
      .editDevice(body, request.user.userId, isAdmin)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.error('Error is:', error);

        let errorMessage = 'Some errors occurred while editing the device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Patch('v1/device/global-unshare/:deviceId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Global unshare device.',
    description: 'This API will globally unshare a device with user',
  })
  async globalUnShareDevice(
    @Param('deviceId') deviceId: string,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);
    await this.deviceService.unshareGlobalDevice(
      deviceId,
      request.user.userId,
      isAdmin,
    );
    return { message: 'Device unshared' };
  }

  @Patch('v1/device/global-share/:deviceId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Global share device.',
    description: 'This API will globally share a device with user',
  })
  async globalShareDevice(
    @Param('deviceId') deviceId: string,
    @Body() body: GlobalShareDto,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);
    await this.deviceService.globalShareDevice(
      deviceId,
      body,
      request.user.userId,
      isAdmin,
    );
    return { message: 'Device sharing updated successfully' };
  }

  @Get('v1/device/get-devices-by-user-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user devices by user id.',
    description: 'Gets user devices by user id. This api requires a user id.',
  })
  async getDevicesByUserId(
    @Param('userId') userId: string,
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

    await this.deviceService
      .getDevicesByUserId(userId)
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

  @Get('v1/device/get-devices-with-encrypted-deviceid-by-user-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a device by user id.',
    description: 'Gets a device by user id. This api requires a user id.',
  })
  async getDevicesWithEncryptedDeviceIdByUserId(
    @Param('userId') userId: string,
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

    await this.deviceService
      .getDevicesWithEncryptedDeviceIdByUserId(userId)
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

  @Patch('v1/device/rename-device')
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

    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceService
      .renameDevice(body, request.user.userId, isAdmin)
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

  @Get('v1/device/get-installed-devices-by-date')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets device installation date and prepares devices installed that day.',
    description: 'This api requires installation date.',
  })
  @ApiQuery({
    name: 'installationYear',
    type: Number,
    required: true,
    description: 'Installation year',
  })
  @ApiQuery({
    name: 'installationMonth',
    type: Number,
    required: true,
    description: 'Installation Month',
  })
  @ApiQuery({
    name: 'installationDay',
    type: Number,
    required: true,
    description: 'Installation Day',
  })
  async getInstalledDevicesByDate(
    @Query('installationYear') installationYear: number,
    @Query('installationMonth') installationMonth: number,
    @Query('installationDay') installationDay: number,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    await this.deviceService
      .getInstalledDevicesByDate(
        installationYear,
        installationMonth,
        installationDay,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed devices!' + error;

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  /* @Get('v1/device/get-number-of-payloads-sent-by-devices-by-date')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets report date and prepares number of payloads sent by each device that day.',
    description: 'This api requires report date.',
  })
  @ApiQuery({
    name: 'reportYear',
    type: Number,
    required: true,
    description: 'Report Year',
  })
  @ApiQuery({
    name: 'reportMonth',
    type: Number,
    required: true,
    description: 'Report Month',
  })
  @ApiQuery({
    name: 'reportDay',
    type: Number,
    required: true,
    description: 'Report Day',
  })
  async getNumberOfPayloadsSentByDevicesByDate(
    @Query('reportYear') reportYear: number,
    @Query('reportMonth') reportMonth: number,
    @Query('reportDay') reportDay: number,
  ) {
    await this.deviceService
      .getNumberOfPayloadsSentByDevicesByDate(
        reportYear,
        reportMonth,
        reportDay,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed devices!' + error;

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */

  @Get('v1/device/get-all-shared-devices')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all shared devices.',
    description: 'Gets all shared devices.',
  })
  async getAllSharedDevices() {
    await this.deviceService
      .getAllSharedDevices()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching shared devices!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/device/get-all-devices')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all installed devices.',
    description: 'Gets all installed devices.',
  })
  async getAllInstalledServices(@Request() request) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }
    await this.deviceService
      .getAllDevices()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching devices!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/device/get-device-info-by-device-encrypted-id/:encryptedId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all installed devices.',
    description: 'Gets all installed devices.',
  })
  async getDeviceInfoByEncryptedId(
    @Param('encryptedId') encryptedId: string,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceService
      .getDeviceInfoByEncryptedId(encryptedId, request.user.userId, isAdmin)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching devices!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('v1/device/delete-device-by-device-id/:deviceId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a device with id.' })
  async deleteDeviceByDeviceId(
    @Param('deviceId') deviceId: string,
    @Request() request,
  ) {
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

    const isAdmin = await this.isAdmin(request.user.userId);

    await this.deviceService
      .deleteDeviceByDeviceId(deviceId, request.user.userId, isAdmin)
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
  }

  @Patch('v1/device/local-share')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Local share device.',
    description: 'This API will locally share a device with user',
  })
  async localShareDevice(@Body() body: LocalShareDto, @Request() request) {
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

    const userEmail = await this.userService.findAUserByEmail(body.userEmail);

    if (userEmail == null) {
      let errorMessage = 'User not found!';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    return await this.deviceService.localShareDeviceWithUserId(
      body.deviceId,
      userEmail._id,
      request.user.userId,
      isAdmin,
    );
  }

  @Patch('v1/device/local-unshare')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Local unshare device.',
    description: 'This API will locally unshare a device with user',
  })
  async localUnshareDevice(@Body() body: LocalShareDto, @Request() request) {
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

    const userEmail = await this.userService.findAUserByEmail(body.userEmail);

    if (userEmail == null) {
      let errorMessage = 'User not found!';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    return await this.deviceService.localUnshareDeviceWithUserId(
      body.deviceId,
      userEmail._id,
      request.user.userId,
      isAdmin,
    );
  }

  @Get('v1/device/:deviceId/local-share/users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Device local shared users.',
    description:
      'This API will return all users that the given device is sharing with.',
  })
  async getUsersDeviceSharingWith(
    @Param('deviceId') deviceId: string,
    @Request() request,
  ) {
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
    const isAdmin = await this.isAdmin(request.user.userId);

    return await this.deviceService.getSharedUsersWithDeviceId(
      deviceId,
      request.user.userId,
      isAdmin,
    );
  }

  @Get('v1/device/get-my-local-shared-devices')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Shared devices with user.',
    description:
      'This API will return all devices that are sharing with a user.',
  })
  async getAllDevicesSharingWithUser(@Request() request) {
    return await this.deviceService.getSharedDevicesWithUserId(
      request.user.userId,
    );
  }
}
