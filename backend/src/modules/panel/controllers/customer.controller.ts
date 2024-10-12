import {
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';

@ApiTags('Manage Panel Customer')
@Controller('app')
export class CustomerController {
  private result;

  constructor(private readonly customerService: CustomerService) {}

  /* @Get('v1/panel-customer/check-customer-email-is-exists/:customerEmail')
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Checks a customer existance by email.',
    description:
      'Checks a customer existance by email. This api requires a customer email.',
  })
  async checkCustomerEmailIsExist(
    @Param('customerEmail') customerEmail: string,
  ) {
    if (
      customerEmail === null ||
      customerEmail === undefined ||
      customerEmail === ''
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'email is required and must be entered.',
      );
    }

    return await this.customerService.checkCustomerEmailIsExist(customerEmail);
  }

  @Post('v1/panel-customer/insert')
  @HttpCode(201)
  @ApiOperation({
    summary: 'inserts a customer in the panel.',
    description: 'This api requires customer profile.',
  })
  async insertCustomer(@Body() body: insertCustomerDto, @Request() request) {
    return await this.customerService.insertCustomer(body);
  }

  @Get('v1/panel-customer/get-customer-by-email/:customerEmail')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a customer by email.',
    description:
      'Gets a customer by user email. This api requires a customer email.',
  })
  async getCustomerByEmail(@Param('customerEmail') customerEmail: string) {
    if (
      customerEmail === null ||
      customerEmail === undefined ||
      customerEmail === ''
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Customer email is required and must be entered and must be entered correctly.',
      );
    }

    await this.customerService
      .getCutomerProfileByEmail(customerEmail)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching customer profile!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete('v1/panel-customer/delete-all-customer-data')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletes all customer data.',
    description: 'This api requires customer id and customer home id.',
  })
  @ApiQuery({
    name: 'customerId',
    type: String,
    required: true,
    description: 'customer ID',
  })
  @ApiQuery({
    name: 'customerHomeId',
    type: String,
    required: true,
    description: 'customer home ID',
  })
  async deleteAllCustomerDataByCustomerIdAndCustomerHomeId(
    @Query('customerId') customerId: string,
    @Query('customerHomeId') customerHomeId: string,
  ) {
    if (
      customerId === null ||
      customerId === undefined ||
      customerId === '' ||
      Types.ObjectId.isValid(String(customerId)) === false
    ) {
      let errorMessage = 'Customer id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    if (
      customerHomeId === null ||
      customerHomeId === undefined ||
      customerHomeId === '' ||
      Types.ObjectId.isValid(String(customerHomeId)) === false
    ) {
      let errorMessage = 'Customer home id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.customerService
      .deleteAllCustomerDataPermanently(customerId, customerHomeId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all customer data in customer controller!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
