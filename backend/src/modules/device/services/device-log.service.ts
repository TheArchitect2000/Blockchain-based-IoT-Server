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

  async getLastDevicesLogByUserIdAndFieldName(userId, devices?) {
    let foundDevices: any = null;
    let foundActivities: any = [];

    if (devices) {
      foundDevices = devices;
    } else {
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
    }

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

  async getDeviceLogByEncryptedDeviceIdAndDateRange(
    deviceEncryptedId: string,
    startDate: Date,
    endDate: Date,
    type: 'day' | 'hour',
    userId: string = '',
    isAdmin: boolean = false,
  ) {
    const foundDevices = await this.deviceService.getDeviceInfoByEncryptedId(
      deviceEncryptedId,
      userId,
      isAdmin,
    );

    console.log('foundDevices:', foundDevices);

    if (foundDevices?.success == false) {
      return foundDevices;
    }

    const query = {
      deviceEncryptedId,
      data: { $exists: true },
      insertDate: { $gte: startDate, $lt: endDate },
    };

    const logs = await this.deviceLogRepository.getDeviceLogs(query);

    console.log('logs2222:', logs);

    const periods = this.generatePeriods(startDate, endDate, type);
    const groupedLogs = this.groupLogsByPeriod(logs, type);

    return periods.map((period) => ({
      periodStart: period,
      data: this.aggregateData(
        groupedLogs.get(this.getPeriodKey(period, type)) || [],
      ),
    }));
  }

  // Helper methods
  private generatePeriods(
    start: Date,
    end: Date,
    type: 'day' | 'hour',
  ): Date[] {
    const periods: Date[] = [];
    let current = this.adjustToPeriodStart(new Date(start), type);
    const endTime = end.getTime();

    while (current.getTime() < endTime) {
      periods.push(new Date(current));
      current = this.nextPeriod(current, type);
    }

    return periods;
  }

  private adjustToPeriodStart(date: Date, type: 'day' | 'hour'): Date {
    const adjusted = new Date(date);
    adjusted.setUTCMilliseconds(0);
    adjusted.setUTCSeconds(0);
    adjusted.setUTCMinutes(0);
    if (type === 'hour') adjusted.setUTCHours(adjusted.getUTCHours());
    else adjusted.setUTCHours(0);
    return adjusted;
  }

  private nextPeriod(date: Date, type: 'day' | 'hour'): Date {
    const next = new Date(date);
    type === 'day'
      ? next.setUTCDate(next.getUTCDate() + 1)
      : next.setUTCHours(next.getUTCHours() + 1);
    return next;
  }

  private groupLogsByPeriod(
    logs: any[],
    type: 'day' | 'hour',
  ): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    for (const log of logs) {
      const periodStart = this.adjustToPeriodStart(
        new Date(log.insertDate),
        type,
      );
      const key = this.getPeriodKey(periodStart, type);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(log);
    }
    return groups;
  }

  private getPeriodKey(date: Date, type: 'day' | 'hour'): string {
    return type === 'day'
      ? `${date.getUTCFullYear()}-${
          date.getUTCMonth() + 1
        }-${date.getUTCDate()}`
      : `${date.getUTCFullYear()}-${
          date.getUTCMonth() + 1
        }-${date.getUTCDate()}-${date.getUTCHours()}`;
  }

  private aggregateData(logs: any[]): Record<string, any> {
    if (!logs.length) return null;

    const dataFields: Record<string, any[]> = {};
    logs.forEach((log) => {
      Object.entries(log.data).forEach(([field, value]) => {
        dataFields[field] = dataFields[field] || [];
        dataFields[field].push(value);
      });
    });

    const aggregated: Record<string, any> = {};
    for (const [field, values] of Object.entries(dataFields)) {
      let numbers: number[] = [];
      let unit: string | null = null;
      let hasNonNumeric = false;

      const allValues = values.map((value) => {
        if (typeof value === 'number') {
          numbers.push(value);
          return value;
        } else if (typeof value === 'string') {
          const match = value.match(/^([\d.]+)(.*)/);
          if (match) {
            const num = parseFloat(match[1]);
            numbers.push(num);
            if (!unit) unit = match[2].trim();
            return num;
          } else {
            hasNonNumeric = true;
            return value;
          }
        } else {
          hasNonNumeric = true;
          return value;
        }
      });

      if (hasNonNumeric) {
        aggregated[field] =
          allValues[Math.floor(Math.random() * allValues.length)];
      } else {
        const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        aggregated[field] = unit
          ? `${avg.toFixed(1)} ${unit}`
          : parseFloat(avg.toFixed(1));
      }
    }

    return aggregated;
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

    console.log('foundDeviceLogs:', foundDeviceLogs);

    return foundDeviceLogs;
  }

  async removeAllDeviceLogsByDayBefore(daysBefore: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBefore);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (daysBefore - 1));
    endDate.setHours(0, 0, 0, 0);

    const deleteQuery = {
      data: { $exists: true },
      insertDate: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const deleteResult = await this.deviceLogRepository.deleteDeviceLogs(
      deleteQuery,
    );

    return {
      success: true,
      message: `All device Logs from exactly ${daysBefore} day(s) ago have been deleted.`,
      result: deleteResult,
    };
  }

  async removeAllDeviceLogsBeforeDaysAgo(daysBefore: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysBefore);
    thresholdDate.setHours(0, 0, 0, 0); // Start of that day

    const deleteQuery = {
      data: { $exists: true },
      insertDate: {
        $lt: thresholdDate,
      },
    };

    const deleteResult = await this.deviceLogRepository.deleteDeviceLogs(
      deleteQuery,
    );

    return {
      success: true,
      message: `All device logs older than ${daysBefore} day(s) have been deleted.`,
      result: deleteResult,
    };
  }

  async removeDeviceLogByEncryptedDeviceIdAndDayBefore(
    deviceEncryptedId: string,
    daysBefore: number,
    userId = '',
    isAdmin = false,
  ) {
    const foundDevices = (await this.deviceService.getDeviceInfoByEncryptedId(
      deviceEncryptedId,
      userId,
      isAdmin,
    )) as any;

    if (foundDevices?.success === false) {
      return foundDevices;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBefore);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (daysBefore - 1));
    endDate.setHours(0, 0, 0, 0);

    const deleteQuery = {
      deviceEncryptedId: deviceEncryptedId,
      data: { $exists: true },
      insertDate: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const deleteResult = await this.deviceLogRepository.deleteDeviceLogs(
      deleteQuery,
    );

    return {
      success: true,
      message: `Logs from exactly ${daysBefore} day(s) ago have been deleted.`,
      result: deleteResult,
    };
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
