import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { HomeRepository } from '../repositories/home.repository';

/**
 * Home manipulation service.
 */

@Injectable()
export class HomeService {
  private result;

  constructor(
    /*  @InjectConnection('panelDb') 
        private connection: Connection, */
    private readonly homeRepository?: HomeRepository,
  ) {}

  /* async insertHome(body) {
    let newHome = {
      Address: null,
      CustomerId: body.customerId,
      Name: body.name,
      Type: body.type,
      Timezone: body.timezone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let insertedHome = await this.homeRepository.insertHome(newHome);
    console.log('Customer home inserted!');
    return insertedHome;
  }

  async getHomeProfileByCustomerId(customerId) {
    let whereCondition = {};
    let populateCondition = [];
    let selectCondition =
      'Address CustomerId Name Type IsActive Guard DeviceType updatedAt updateAt Timezone';
    let foundHome: any = null;

    console.log('we are in getHomeProfileByCustomerId service!');

    foundHome = await this.homeRepository.findHomeByCustomerId(
      customerId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found Home is: ', foundHome);

    return await foundHome;
  }

  async deleteCustomerHomePermanently(customerHomeId) {
    await this.homeRepository
      .deleteCustomerHomePermanently(customerHomeId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting customer home in home service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
