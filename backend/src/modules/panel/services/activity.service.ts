import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ActivityRepository } from '../repositories/activity.repository';
import * as randompassword from 'secure-random-password';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

/**
 * Activity manipulation service.
 */

@Injectable()
export class ActivityService {
  private result;

  constructor(
    /*  @InjectConnection('panelDb') 
        private connection: Connection, */
    private readonly activityRepository?: ActivityRepository,
  ) {}

  /* async getDeviceActivityByEncryptedDeviceIdAndFieldName(
    deviceEncryptedId,
    fieldName,
  ) {
    let foundActivities: any = null;

    let query = {
      DeviceEncId: deviceEncryptedId,
    };
    query[fieldName] = { $exists: true };

    console.log(query);

    foundActivities =
      await this.activityRepository.getDeviceActivityByEncryptedDeviceIdAndFieldName(
        query,
      );

    console.log(foundActivities);

    return foundActivities;
  }

  async getDeviceActivityByEncryptedDeviceIdAndFieldNameAndDate(
    deviceEncryptedId,
    fieldName,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  ) {
    let foundActivities: any = null;

    let query = {
      DeviceEncId: deviceEncryptedId,
      createdAt: {
        $gte: new Date(startYear, startMonth - 1, startDay),
        $lt: new Date(endYear, endMonth - 1, endDay),
      },
    };
    query[fieldName] = { $exists: true };

    console.log(query);

    foundActivities =
      await this.activityRepository.getDeviceActivityByEncryptedDeviceIdAndFieldNameAndDate(
        query,
      );

    console.log(foundActivities);

    return foundActivities;
  }

  async deleteCustomerAllActivitiesPermanently(customerHomeId) {
    await this.activityRepository
      .deleteAllCustomerActivitiesPermanently(customerHomeId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting customer activities in activity service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
