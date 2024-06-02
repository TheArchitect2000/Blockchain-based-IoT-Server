import { Injectable } from '@nestjs/common';
import { VMService } from './vm.service';
import { DeviceService } from 'src/modules/device/services/device.service';

@Injectable()
export class ServiceHandlerService {
  constructor(
    private readonly vmService: VMService,
    private readonly deviceService: DeviceService,
  ) {}

  async handleDeviceData(deviceEncryptedId, parsedPayload) {
    const deviceData: any = await this.deviceService.getDeviceInfoByEncryptedId(deviceEncryptedId);
    parsedPayload.data = {...parsedPayload.data, mac: deviceData.mac, name: deviceData.deviceName, type: deviceData.deviceType}
    await this.vmService.executeServiceCode(deviceEncryptedId, parsedPayload);
  }
}
