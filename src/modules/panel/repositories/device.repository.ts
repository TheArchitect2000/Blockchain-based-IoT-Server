import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceModel } from '../models/device.model';

@Injectable()
export class DeviceRepository {
  private result;

  constructor(
    @InjectModel('iadevice', 'panelDb') // panelDb is defined in app.module.ts
    private readonly deviceModel?: DeviceModel,
  ) {}

  async insertDevice(data) {
    await this.deviceModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while device insertion in panel!';
        console.error('Error is: ', error);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceModel.create(data)
  }

  async findDeviceById(
    deviceId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findDevicesById repository!');

    return await this.deviceModel
      .findOne({ _id: deviceId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findDevicesByHomeId(
    homeId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findDeviceByHomeId repository!');

    return await this.deviceModel
      .find({ HomeId: homeId })
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
      .findOne({ MAC: deviceMac })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async editDevice(id, editedData) {
    await this.deviceModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device update!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllCustomerDevicesPermanently(homeId) {
    const deviceHomeId = new Types.ObjectId(homeId);

    await this.deviceModel
      .deleteMany()
      .where({ HomeId: deviceHomeId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting devices in device repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }
}
