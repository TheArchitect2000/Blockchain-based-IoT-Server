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
import { insertHomeDto } from '../data-transfer-objects/home/insert-home.dto';
import { HomeService } from '../services/home.service';

@ApiTags('Manage Panel Home')
@Controller('app')
export class HomeController {
  private result;

  constructor(private readonly homeService: HomeService) {}

  /* @Post('v1/panel-home/insert')
  @HttpCode(201)
  @ApiOperation({
    summary: 'inserts a customer home in the panel.',
    description: 'This api requires customer home profile.',
  })
  async insertCustomer(@Body() body: insertHomeDto, @Request() request) {
    return await this.homeService.insertHome(body);
  }

  @Get('v1/panel-home/get-home-by-customer-id/:customerId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a home by customer id.',
    description: 'Gets a home by customer id. This api requires a customer id.',
  })
  async panelHomeTest(@Param('customerId') customerId: string) {
    if (
      customerId === null ||
      customerId === undefined ||
      customerId === '' ||
      Types.ObjectId.isValid(String(customerId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Customer id is required and must be entered and must be entered correctly.',
      );
    }

    await this.homeService
      .getHomeProfileByCustomerId(customerId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching home profile!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
