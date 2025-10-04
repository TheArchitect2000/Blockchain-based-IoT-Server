import { Inject, Injectable } from '@nestjs/common';
import { log } from 'console';
import { DeviceLogService } from 'src/modules/device/services/device-log.service';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';

/**
 * MQTT broker log service.
 */

@Injectable()
export class MqttLogService {
  constructor(
    // @Inject('DeviceLogService')
    private readonly deviceLogService?: DeviceLogService,
  ) {}

  async logDeviceEvent(body) {
    let insertedDeviceLogEvent: any = null;

    insertedDeviceLogEvent = await this.deviceLogService
      .insertDeviceLogEvent(body)
      .then((data) => {
        insertedDeviceLogEvent = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device log in mqtt log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });
    console.log('Device event log inserted!');
    return insertedDeviceLogEvent;
  }

  async logDeviceData(body) {
    let insertedDeviceLogEvent: any = null;

    insertedDeviceLogEvent = await this.deviceLogService
      .insertDeviceLogData(body)
      .then((data) => {
        insertedDeviceLogEvent = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device log in mqtt log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    console.log('Device data log inserted!');
    return insertedDeviceLogEvent;
  }

  async testLogService() {
    console.log('\x1b[5m', '\x1b[33m', '\nTesting log service...', '\x1b[0m');
    console.log('\x1b[32m --------------------------------- \x1b[0m');
    console.log('\x1b[32m Log service Test Successful. \x1b[0m');
    console.log('\x1b[32m --------------------------------- \x1b[0m');
  }
}
