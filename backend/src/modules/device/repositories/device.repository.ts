import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceModel } from '../models/device.model';

@Injectable()
export class DeviceRepository {
  private result;

  constructor(
    @InjectModel('device')
    private readonly deviceModel?: DeviceModel,
  ) {}

  async insertDevice(data) {
    await this.deviceModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device insertion!';
        console.log(error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceModel.create(data)
  }

  async editDevice(id, editedData) {
    await this.deviceModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getDeviceById(_id, whereCondition, populateCondition, selectCondition) {
    return await this.deviceModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getDevicesByUserId(
    userId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in getDevicesByUserId repository!');

    return await this.deviceModel
      .find({ userId: userId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findDeviceByMac(
    deviceMac,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findDeviceByMac repository!');

    return await this.deviceModel
      .findOne({ mac: deviceMac })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getInstalledDevicesByDate(query) {
    return await this.deviceModel.find(query);
  }

  async getAllActiveDevices(query) {
    return await this.deviceModel.find(query);
  }

  async deleteAllUserDevicesPermanently(userId) {
    const deviceUserId = new Types.ObjectId(userId);

    await this.deviceModel
      .deleteMany()
      .where({ userId: deviceUserId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting devices in device repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.deviceModel.paginate(
      finalQuery,
      options,
      (error, data) => {
        if (error) {
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'An error occurred while paginate users.',
          );
        } else {
          return data;
        }
      },
    );
  }

  async getDeviceByEncryptedId(
    encryptId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in getAllDevices repository!');

    return await this.deviceModel
      .findOne({ deviceEncryptedId: encryptId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getAllDevices(whereCondition, populateCondition, selectCondition) {
    console.log('we are in getAllDevices repository!');

    return await this.deviceModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }
}
