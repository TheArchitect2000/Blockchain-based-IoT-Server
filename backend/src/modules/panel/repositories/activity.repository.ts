import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ActivityModel } from '../models/activity.model';
import { HomeModel } from '../models/home.model';

@Injectable()
export class ActivityRepository {
  private result;

  constructor() /* @InjectModel('iaactivity', 'panelDb') // panelDb is defined in app.module.ts
    private readonly activityModel?: ActivityModel, */
  {}

  /* async getDeviceActivityByEncryptedDeviceIdAndFieldName(query) {
    return await this.activityModel
      .findOne(query)
      .sort({ $natural: -1 })
      .limit(1);
  }

  async getDeviceActivityByEncryptedDeviceIdAndFieldNameAndDate(query) {
    return await this.activityModel.find(query);
  }

  async deleteAllCustomerActivitiesPermanently(homeId) {
    const activityHomeId = new Types.ObjectId(homeId);

    await this.activityModel
      .deleteMany()
      .where({ HomeId: activityHomeId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting activities in activity repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  } */
}
