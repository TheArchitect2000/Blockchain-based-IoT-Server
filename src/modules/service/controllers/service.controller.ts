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
import { ServiceService } from '../services/service.service';
import { insertServiceDto } from '../data-transfer-objects/insert-service.dto';
import { editServiceDto } from '../data-transfer-objects/edit-service.dto';
import { publishServiceDto } from '../data-transfer-objects/publish-service.dto';
import { UserService } from 'src/modules/user/services/user/user.service';

@ApiTags('Manage Services')
@Controller('app')
export class ServiceController {
  private result;

  constructor(
    private readonly serviceService: ServiceService,
    private readonly userService: UserService,
  ) {}

  @Post('v1/service/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Inserts a user service.',
    description:
      'This api requires user service profile. Devices are array device Ids.',
  })
  async insertService(@Body() body: insertServiceDto, @Request() request) {
    return await this.serviceService.insertService(body);
  }

  @Patch('v1/service/request-service-publish')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publishing a user service.',
    description:
      'This API will publish an service that is sended a request for publishing.',
  })
  async requestServicePublish(@Body() body: publishServiceDto, @Request() request) {
    return await this.serviceService.requestServicePublish(body, request.user.userId);
  }

  @Patch('v1/service/publish-service')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publishing a user service.',
    description:
      'This API will publish an service that is sended a request for publishing.',
  })
  async publishService(@Body() body: publishServiceDto, @Request() request) {
    const profile = await this.userService.getUserProfileByIdFromUser(request.user.userId) as any;
    if ( !profile || !profile?.roles[0]?.name || profile?.roles[0]?.name != "super_admin" ) {
      return { success: false, message: "User permission error!"};
    }
    return await this.serviceService.publishService(body, request.user.userId);
  }

  @Patch('v1/service/reject-service')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publishing a user service.',
    description:
      'This API will publish an service that is sended a request for publishing.',
  })
  async rejectService(@Body() body: publishServiceDto, @Request() request) {
    const profile = await this.userService.getUserProfileByIdFromUser(request.user.userId) as any;
    if ( !profile || !profile?.roles[0]?.name || profile?.roles[0]?.name != "super_admin" ) {
      return { success: false, message: "User permission error!"};
    }
    return await this.serviceService.rejectService(body, request.user.userId);
  }

  @Patch('v1/service/edit')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edites service.',
    description: 'Edites service by service ID and other fields.',
  })
  async editService(@Body() body: editServiceDto, @Request() request) {
    console.log('We are in editService controller');

    if (
      body.serviceId === null ||
      body.serviceId === undefined ||
      body.serviceId === '' ||
      Types.ObjectId.isValid(String(body.serviceId)) === false
    ) {
      let errorMessage = 'Service id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.serviceService
      .editService(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing the service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/service/get-services-by-user-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user services by user id.',
    description: 'Gets user services by user id. This api requires a user id.',
  })
  async getServicesByUserId(@Param('userId') userId: string) {
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

    await this.serviceService
      .getServicesByUserId(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/service/get-all-published-services')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all published services.',
    description: 'Gets all the services that are published.',
  })
  async getAllPublishedServices() {
    await this.serviceService
      .getAllPublishedServices()
      .then((response) => {
        this.result = response
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching services!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/service/get-all-publish-requested-services')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all publish requested services.',
    description: 'Gets all the services that are requesting for publish.',
  })
  async getAllPublishRequestedServices() {
    await this.serviceService
      .getAllPublishRequestedServices()
      .then((response) => {
        this.result = response
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching services!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
  
  @Get('v1/service/get-all-services')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all services.',
    description: 'Gets all services.',
  })
  async getAllServices() {
    await this.serviceService
      .getAllServices()
      .then((response) => {
        this.result = response
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching services!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('v1/service/delete-service-by-service-id/:serviceId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a service with id.' })
  async deleteServiceBServiceId(
    @Param('serviceId') serviceId: string,
    @Request() request,
  ) {
    if (
      serviceId === null ||
      serviceId === undefined ||
      serviceId === '' ||
      Types.ObjectId.isValid(String(serviceId)) === false
    ) {
      let errorMessage = 'Device id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.serviceService
      .deleteServiceByServiceId(serviceId, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while deleting the service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
