import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { CustomerModel } from '../models/customer.model';

@Injectable()
export class CustomerRepository {
  private result;

  constructor /* @InjectModel('iacustomer', 'panelDb') // panelDb is defined in app.module.ts
    private readonly customerModel?: CustomerModel, */() {}

  /* async insertCustomer(data) {
    await this.customerModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while customer insertion in panel!';
        console.error('Error is: ', error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.customerModel.create(data)
  }

  async findCustomerById(
    _id,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.customerModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findCustomerByEmail(
    customerEmail,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {


    return await this.customerModel
      .findOne({ Email: customerEmail })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async editCustomer(id, editedData) {
    await this.customerModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while customer update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteCustomerPermanently(customerId) {
    const customerProfileId = new Types.ObjectId(customerId);

    await this.customerModel
      .deleteMany()
      .where({ _id: customerProfileId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting customer in customer repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  } */
}
