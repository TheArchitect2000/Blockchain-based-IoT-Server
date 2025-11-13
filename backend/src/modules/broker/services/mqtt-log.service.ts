import { Injectable } from '@nestjs/common';
import { DeviceLogService } from 'src/modules/device/services/device-log.service';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';

/**
 * MQTT broker log service.
 */

@Injectable()
export class MqttLogService {
  constructor(private readonly deviceLogService?: DeviceLogService) {}

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

    return insertedDeviceLogEvent;
  }
}
