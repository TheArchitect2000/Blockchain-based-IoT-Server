import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MqttService } from '../services/mqtt.service';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

@ApiTags('MQTT Broker')
@Controller('app')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Get('v1/mqtt/status')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get MQTT broker status.',
    description: 'Returns the current status of the MQTT broker and any error messages if unavailable.',
  })
  async getBrokerStatus() {
    const isAvailable = this.mqttService.isBrokerReady();
    const error = this.mqttService.getBrokerError();

    return {
      available: isAvailable,
      error: error || null,
      message: isAvailable
        ? 'MQTT broker is available and running'
        : 'MQTT broker is unavailable',
    };
  }

  /**
   * Helper method to check broker availability and throw error if unavailable
   * This can be used by other controllers/services that require MQTT
   */
  ensureBrokerAvailable() {
    if (!this.mqttService.isBrokerReady()) {
      const error = this.mqttService.getBrokerError();
      throw new GeneralException(
        ErrorTypeEnum.INTERNAL_SERVER_ERROR,
        `MQTT broker is unavailable. ${error ? `Error: ${error}` : 'Please check broker configuration.'}`,
      );
    }
  }
}
