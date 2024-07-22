import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { HomeModel } from '../models/home.model';

@Injectable()
export class HomeRepository {
  private result;

  constructor(
    /* @InjectModel('iahome', 'panelDb') // panelDb is defined in app.module.ts
    private readonly homeModel?: HomeModel, */
  ) {}

  /* async insertHome(data) {
    await this.homeModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while home insertion in panel!';
        console.error('Error is: ', error);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.homeModel.create(data)
  }

  async findHomeByCustomerId(
    customerId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findCustomerByEmail repository!');

    return await this.homeModel
      .findOne({ CustomerId: customerId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async deleteCustomerHomePermanently(homeId) {
    const deviceHomeId = new Types.ObjectId(homeId);

    await this.homeModel
      .deleteMany()
      .where({ _id: deviceHomeId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting home in home repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  } */
}
