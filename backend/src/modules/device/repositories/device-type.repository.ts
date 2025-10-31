import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceTypeModel } from '../models/device-type.model';

@Injectable()
export class DeviceTypeRepository {
  private result;

  constructor(
    @InjectModel('device-type')
    private readonly deviceTypeModel?: DeviceTypeModel,
  ) {}

  async insertDeviceType(data) {
    await this.deviceTypeModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device type insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceTypeModel.create(data)
  }

  async editDeviceType(id, editedData) {
    await this.deviceTypeModel
      .updateOne({ _id: { $eq: id } }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device type update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findDeviceTypeById(
    _id,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.deviceTypeModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findAllDeviceTypes(whereCondition, populateCondition, selectCondition) {
    return await this.deviceTypeModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async paginate(finalQuery, options) {
    return await this.deviceTypeModel.paginate(
      finalQuery,
      options,
      (error, data) => {
        if (error) {
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'An error occurred while paginate device types.',
          );
        } else {
          return data;
        }
      },
    );
  }
}
