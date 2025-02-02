import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { log } from 'console';
import { DeviceLogRepository } from '../repositories/device-log.repository';
import { DeviceService } from './device.service';
//import { Cron } from '@nestjs/schedule';

/**
 * Device log manipulation service.
 */

@Injectable()
export class DeviceLogService {
  private result;

  constructor(
    @Inject(forwardRef(() => DeviceService)) // For avoid circular dependency
    private readonly deviceService: DeviceService,
    private readonly deviceLogRepository: DeviceLogRepository,
  ) {}

  /* async insertDeviceLogEvent(deviceEncryptedId, event) {
        let deviceLog = {
            event: event,
            deviceEncryptedId: deviceEncryptedId,
            insertDate: new Date(),
        }

        console.log("deviceLog", deviceLog);
        
        let insertedDeviceLog;

        await this.deviceLogRepository.insertDeviceLog(deviceLog)
        .then((data) => {
            insertedDeviceLog = data
        })
        .catch((error)=>{
            console.error(error);
            let errorMessage = 'Some errors occurred while inserting device log in device log service!';
            throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
        })
        return insertedDeviceLog;
    } */

  async insertDeviceLogEvent(body) {
    let deviceLog = {
      deviceEncryptedId: body.deviceEncryptedId,
      event: body.event,
      insertDate: new Date(),
    };

    let insertedDeviceLog;

    await this.deviceLogRepository
      .insertDeviceLog(deviceLog)
      .then((data) => {
        insertedDeviceLog = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device log in device log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
    return insertedDeviceLog;
  }

  async insertDeviceLogData(body) {
    let deviceLog = {
      deviceEncryptedId: body.deviceEncryptedId,
      event: body.event,
      data: body.data,
      senderDeviceEncryptedId: body.senderDeviceEncryptedId,
      insertDate: new Date(),
    };

    let insertedDeviceLog;

    await this.deviceLogRepository
      .insertDeviceLog(deviceLog)
      .then((data) => {
        insertedDeviceLog = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device log in device log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
    return insertedDeviceLog;
  }

  async getDeviceLogByEncryptedDeviceIdAndFieldName(
    deviceEncryptedId,
    userId = '',
    isAdmin = false,
    onlyPublished = false,
  ) {

    //this.deviceService.checkDeviceIsExist()

    const foundDevices = (await this.deviceService.getDeviceInfoByEncryptedId(
      deviceEncryptedId,
      userId,
      isAdmin,
    )) as any;

    if (foundDevices?.success == false) {
      return foundDevices;
    }

    let foundActivities: any = null;

    let query: any = {
      deviceEncryptedId: deviceEncryptedId,
      data: { $exists: true },
    };

    if (onlyPublished) {
      query.event = 'published';
    }

    foundActivities =
      await this.deviceLogRepository.getDeviceLogByEncryptedDeviceIdAndFieldName(
        query,
      );

    if (query !== null) {
      return foundActivities;
    }
  }

  async getLastDevicesLogByUserIdAndFieldName(userId) {
    let foundDevices: any = null;
    let foundActivities: any = [];

    await this.deviceService
      .getDevicesByUserId(userId)
      .then((data) => {
        foundDevices = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed devices profiles!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    for (const element of foundDevices) {
      let foundDeviceLog;
      await this.getDeviceLogByEncryptedDeviceIdAndFieldName(
        element.deviceEncryptedId,
      )
        .then((data) => {
          if (data !== null) {
            foundDeviceLog = data;

            element.payloadsSent = foundDeviceLog.length;
            foundActivities.push(foundDeviceLog);
          }
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding logs for installed active devices!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }
    return foundActivities;
  }

  async getLastLocalDevicesLogByUserIdAndFieldName(userId) {
    let foundDevices: any = null;
    let foundActivities: any = [];

    await this.deviceService
      .getSharedDevicesWithUserId(userId)
      .then((data) => {
        foundDevices = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed devices profiles!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    for (const element of foundDevices) {
      let foundDeviceLog;
      await this.getDeviceLogByEncryptedDeviceIdAndFieldName(
        element.deviceEncryptedId,
        
      )
        .then((data) => {
          if (data !== null) {
            foundDeviceLog = data;

            element.payloadsSent = foundDeviceLog.length;
            foundActivities.push(foundDeviceLog);
          }
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding logs for installed active devices!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }
    return foundActivities;
  }

  async getDeviceLogByEncryptedDeviceIdAndFieldNameAndDate(
    deviceEncryptedId,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    userId = '',
    isAdmin = false,
  ) {
    const foundDevices = (await this.deviceService.getDeviceInfoByEncryptedId(
      deviceEncryptedId,
      userId,
      isAdmin,
    )) as any;

    if (foundDevices?.success == false) {
      return foundDevices;
    }

    let foundDeviceLogs: any = null;

    let query = {
      deviceEncryptedId: deviceEncryptedId,
      data: { $exists: true },
      insertDate: {
        $gte: new Date(startYear, startMonth - 1, startDay),
        $lt: new Date(endYear, endMonth - 1, endDay),
      },
    };

    foundDeviceLogs = await this.deviceLogRepository.getDeviceLogs(query);

    //console.log(foundDeviceLogs);

    return foundDeviceLogs;
  }

  async getDeviceLogByEncryptedDeviceIdAndFieldNameAndNumberOfDaysBefore(
    deviceEncryptedId,
    daysBefore,
    userId = '',
    isAdmin = false,
  ) {
    const foundDevices = (await this.deviceService.getDeviceInfoByEncryptedId(
      deviceEncryptedId,
      userId,
      isAdmin,
    )) as any;

    if (foundDevices?.success == false) {
      return foundDevices;
    }

    let foundDeviceLogs: any = null;

    let endDate = new Date();
    endDate.setDate(endDate.getDate() - (daysBefore - 1));
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBefore);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    let query = {
      deviceEncryptedId: deviceEncryptedId,
      data: { $exists: true },
      insertDate: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    foundDeviceLogs = await this.deviceLogRepository.getDeviceLogs(query);

    return foundDeviceLogs;
  }

  async getDeviceLogByEncryptedDeviceIdAndDate(
    deviceEncryptedId,
    reportYear,
    reportMonth,
    reportDay,
  ) {
    let foundDeviceLogs: any = null;

    let startDate = new Date(reportYear, reportMonth - 1, reportDay);
    let endDate = new Date(reportYear, reportMonth - 1, reportDay);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

    let query = {
      deviceEncryptedId: deviceEncryptedId,
      insertDate: {
        $gte: startDate,
        $lt: endDate,
      },
      data: { $exists: true },
    };

    foundDeviceLogs = await this.deviceLogRepository.getDeviceLogs(query);

    return foundDeviceLogs;
  }

  async deleteAllUserDeviceLogsPermanently(deviceEncryptedId: string) {
    await this.deviceLogRepository
      .deleteAllUserDeviceLogsPermanently(deviceEncryptedId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting device logs in device log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
