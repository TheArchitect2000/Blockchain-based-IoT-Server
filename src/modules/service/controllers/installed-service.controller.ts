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
import { InstalledServiceService } from '../services/installed-service.service';
import { insertInstalledServiceDto } from '../data-transfer-objects/insert-installed-service.dto';
import { editInstalledServiceDto } from '../data-transfer-objects/edit-installed-service.dto';
import { MailService } from 'src/modules/utility/services/mail.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { VirtualMachineHandlerService } from 'src/modules/virtual-machine/services/service-handler.service';

@ApiTags('Manage Installed Services')
@Controller('app')
export class InstalledServiceController {
  private result;
  private virtualsCreated = false;

  constructor(
    private readonly installedServiceService: InstalledServiceService,
    private readonly VirtualMachineService?: VirtualMachineHandlerService,
  ) {}

  @Post('v1/installed-service/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Inserts a user installed service.',
    description:
      'This api requires installed service profile. Devices are array device Ids.',
  })
  async insertInstalledService(
    @Body() body: insertInstalledServiceDto,
    @Request() request,
  ) {
    const res = await this.installedServiceService.insertInstalledService(body);

    this.VirtualMachineService.createVirtualMachine(body, res._id);

    return res;
  }

  @Post('v1/installed-service/create-all-virtual-machines')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates All Virtual Machines.',
    description: '',
  })
  async createAllInstalledServicesVirtualMachines(@Request() request) {
    if (this.virtualsCreated === false) {
      this.virtualsCreated = true;
      return this.VirtualMachineService.createAllVirtualMachines();
    } else {
      return false;
    }
  }

  @Patch('v1/installed-service/edit')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edites installed service.',
    description:
      'Edites installed service by installed service ID and other fields.',
  })
  async editInstalledService(
    @Body() body: editInstalledServiceDto,
    @Request() request,
  ) {
    console.log('We are in editService controller');

    if (
      body.installedServiceId === null ||
      body.installedServiceId === undefined ||
      body.installedServiceId === '' ||
      Types.ObjectId.isValid(String(body.installedServiceId)) === false
    ) {
      let errorMessage = 'Installed service id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.installedServiceService
      .editInstalledService(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing the installed service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/installed-service/get-installed-services-by-user-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user installed services by user id.',
    description:
      'Gets user installed services by user id. This api requires a user id.',
  })
  async getInstalledServicesByUserId(@Param('userId') userId: string) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Home id is required and must be entered and must be entered correctly.',
      );
    }

    await this.installedServiceService
      .getInstalledServicesByUserId(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get(
    'v1/installed-service/get-installed-services-by-device-encrypted-id/:deviceEncryptedId',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user installed services by device encrypted id.',
    description:
      'Gets user installed services by user id. This api requires a user id.',
  })
  async getInstalledServicesByDeviceEncryptedId(
    @Param('deviceEncryptedId') deviceEncryptedId: string,
  ) {
    await this.installedServiceService
      .getInstalledServicesByDeviceEncryptedId(deviceEncryptedId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/installed-service/get-all-installed-services')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all installed services.',
    description: 'Gets all installed services.',
  })
  async getAllInstalledServices() {
    await this.installedServiceService
      .getAllInstalledServices()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete(
    'v1/installed-service/delete-installed-service-by-installed-service-id/:installedServiceId',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a installed service with id.' })
  async deleteInstalledServiceByInstalledServiceId(
    @Param('installedServiceId') installedServiceId: string,
    @Request() request,
  ) {
    if (
      installedServiceId === null ||
      installedServiceId === undefined ||
      installedServiceId === '' ||
      Types.ObjectId.isValid(String(installedServiceId)) === false
    ) {
      let errorMessage = 'Installed service id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    this.VirtualMachineService.deleteVirtualMachinByServiceId(
      installedServiceId,
    );

    await this.installedServiceService
      .deleteInstalledServiceByInstalledServiceId(
        installedServiceId,
        request.user.userId,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.log('Errrrrrrorrrrrrrrrrrrrrr Isssssssssssssss:', error);

        let errorMessage =
          'Some errors occurred while deleting the installed service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
