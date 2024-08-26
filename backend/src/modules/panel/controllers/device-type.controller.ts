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
import { DeviceTypeService } from '../services/device-type.service';

@ApiTags('Manage Panel Device Type')
@Controller('app')
export class DeviceTypeController {
  private result;

  constructor(private readonly deviceTypeService: DeviceTypeService) {}

  /* @Get('v1/panel-device-type/get-all-device-types')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all device types.',
    description: 'Gets all device types.',
  })
  async getDevicesByHomeId() {
    await this.deviceTypeService
      .getAllDeviceTypes()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching device types!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
