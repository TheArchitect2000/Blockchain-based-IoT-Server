import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Patch,
  Delete,
  Request,
  Response,
  UseGuards,
  Param,
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MqttLogService } from '../services/mqtt-log.service';
import { DeviceLogService } from 'src/modules/device/services/device-log.service';
import { DeviceEventsEnum } from '../enums/device-events.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { logDeviceEventDto } from '../data-transfer-object/log-device-event.dto';
import { logDeviceDataDto } from '../data-transfer-object/log-device-data.dto';

@ApiTags('Manage MQTT Logs')
@Controller('app')
export class MqttLogController {
  constructor(
    private readonly mqttLogService?: MqttLogService,
    private readonly deviceLogService?: DeviceLogService,
  ) {}

  /* @Get('v1/broker-mqtt-log/log-event')
    async logEvent() {
        let insertedDeviceLogEvent : any = null;
        
        insertedDeviceLogEvent = await this.deviceLogService.insertDeviceLogEvent('QTA6NzY6NEU6NTc6MkI6NDg=', DeviceEventsEnum.CONNECTED)
        .then((data) => {
            insertedDeviceLogEvent = data
        })
        .catch((error)=>{
            console.error(error);
            let errorMessage = 'Some errors occurred while inserting device log in mqtt log service!';
            throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
        })
        console.log("Device log inserted!")
    } */

  @Post('v1/broker-mqtt-log/log-device-event')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Logs device events.',
    description: 'This api requires a user encrypted device id and event.',
  })
  async logDeviceEvent(@Body() body: logDeviceEventDto, @Request() request) {
    let insertedDeviceLogEvent: any = null;
    insertedDeviceLogEvent = await this.mqttLogService
      .logDeviceEvent(body)
      .then((data) => {
        insertedDeviceLogEvent = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device event log in mqtt log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return insertedDeviceLogEvent;
  }

  @Post('v1/broker-mqtt-log/log-device-data')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Logs device data.',
    description:
      'This api requires a user encrypted device id and data and sender device id.',
  })
  async logDeviceData(@Body() body: logDeviceDataDto, @Request() request) {
    let insertedDeviceLogEvent: any = null;
    insertedDeviceLogEvent = await this.mqttLogService
      .logDeviceData(body)
      .then((data) => {
        insertedDeviceLogEvent = data;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage =
          'Some errors occurred while inserting device data log in mqtt log service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return insertedDeviceLogEvent;
  }
}
