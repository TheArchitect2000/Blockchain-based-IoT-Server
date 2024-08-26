import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceLogModel } from '../models/device-log.model';

@Injectable()
export class DeviceLogRepository {
  private result;

  constructor(
    @InjectModel('device-log')
    private readonly deviceLogModel: DeviceLogModel,
  ) {}

  async insertDeviceLog(data) {
    await this.deviceLogModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device log insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceLogModel.create(data)
  }

  async editDeviceLog(id, editedData) {
    await this.deviceLogModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device log update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findDeviceLogById(
    _id,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.deviceLogModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getDeviceLogByEncryptedDeviceIdAndFieldName(query) {
    return await this.deviceLogModel
      .findOne(query)
      .sort({ $natural: -1 })
      .limit(1);
  }

  async getDeviceLogs(query) {
    return await this.deviceLogModel.find(query);
  }

  async deleteAllUserDeviceLogsPermanently(deviceEncryptedId) {
    await this.deviceLogModel
      .deleteMany()
      .where({ deviceEncryptedId: deviceEncryptedId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting device logs in device log repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.deviceLogModel.paginate(
      finalQuery,
      options,
      (error, data) => {
        if (error) {
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'An error occurred while paginate device logs.',
          );
        } else {
          return data;
        }
      },
    );
  }
}
