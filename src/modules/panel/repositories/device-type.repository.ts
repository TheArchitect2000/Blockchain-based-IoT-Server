import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceTypeModel } from '../models/device-type.model';

@Injectable()
export class DeviceTypeRepository {
  private result;

  constructor(
    /* @InjectModel('iadevicetype', 'panelDb') // panelDb is defined in app.module.ts
    private readonly deviceTypeModel?: DeviceTypeModel, */
  ) {}

  /* async insertDeviceType(data) {
    await this.deviceTypeModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while device type insertion in panel!';
        console.error('Error is: ', error);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceTypeModel.create(data)
  }

  async findAllDeviceTypes(whereCondition, populateCondition, selectCondition) {
    console.log('we are in findAllDeviceTypes repository!');

    return await this.deviceTypeModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  } */
}
