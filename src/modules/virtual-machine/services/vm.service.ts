import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as ivm from 'isolated-vm';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { MailService } from 'src/modules/utility/services/mail.service';

@Injectable()
export class VMService implements OnModuleInit {
  private readonly logger = new Logger(VMService.name);
  private vmPool: Map<string, Array<{ isolate: ivm.Isolate, context: ivm.Context, jail: ivm.Reference<any> }>>;

  constructor(
    private readonly installedServiceService: InstalledServiceService,
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {
    this.vmPool = new Map<string, Array<{ isolate: ivm.Isolate, context: ivm.Context, jail: ivm.Reference<any> }>>();
  }

  async onModuleInit() {
    await this.initializeVMPool();
  }

  private async initializeVMPool() {
    const installedServices = await this.installedServiceService.getAllInstalledServices();
    installedServices.forEach(service => {
      const isolate = new ivm.Isolate({ memoryLimit: 128 });
      const context = isolate.createContextSync();
      const jail = context.global;
      jail.setSync('global', jail.derefInto());
      jail.setSync('sendMail', (emailJson) => this.sendMail(service.userId, emailJson));
      jail.setSync('sendNotification', (notificationJson) => this.sendNotification(service.userId, notificationJson));

      const serviceVM = { isolate, context, jail };
      if (this.vmPool.has(service.deviceEncryptedId)) {
        this.vmPool.get(service.deviceEncryptedId).push(serviceVM);
      } else {
        this.vmPool.set(service.deviceEncryptedId, [serviceVM]);
      }
    });
  }

  async executeServiceCode(deviceEncryptedId: string, deviceData: any) {
    const vmInstances = this.vmPool.get(deviceEncryptedId);
    if (vmInstances) {
      try {
        const services = await this.installedServiceService.getInstalledServicesByDeviceEncryptedId(deviceEncryptedId);
        for (const service of services) {
          const vmInstance = vmInstances.find(vm => vm.jail.deref().serviceId === service._id.toString());
          if (vmInstance) {
            const { context } = vmInstance;
            const preparedCode = this.prepareServiceCode(service.code, deviceData);
            const script = `(function() { ${preparedCode} })()`;
            await context.evalClosureSync(script, [], { arguments: { copy: true } });
          } else {
            this.logger.warn(`No VM instance found for service ID: ${service._id}`);
          }
        }
      } catch (error) {
        this.logger.error('Error executing service code:', error);
      }
    } else {
      this.logger.error(`No VM found for deviceEncryptedId: ${deviceEncryptedId}`);
    }
  }

  private prepareServiceCode(serviceCode: string, deviceData: any): string {
    let editedServiceCode = serviceCode;

    const replacements = {
      "MULTI_SENSOR_1.MAC": deviceData.mac,
      "MULTI_SENSOR_1.TYPE": deviceData.type,
      "MULTI_SENSOR_1.NAME": deviceData.name,
      "MULTI_SENSOR_1.TEMPERATURE": deviceData.Temperature,
      "MULTI_SENSOR_1.HUMIDITY": deviceData.Humidity,
      "MULTI_SENSOR_1.DOOR.OPENED": deviceData.Door === 'Open',
      "MULTI_SENSOR_1.DOOR.CLOSED": deviceData.Door === 'Close',
      "MULTI_SENSOR_1.MOTION.DETECTED": deviceData.Movement === 'Detected',
      "MULTI_SENSOR_1.MOTION.UNDETECTED": deviceData.Movement === 'Scanning...',
      "MULTI_SENSOR_1.PRESSED": deviceData.Button === 'Pressed',
      "MULTI_SENSOR_1.NOT_PRESSED": deviceData.Button !== 'Pressed',
    };

    for (const [key, value] of Object.entries(replacements)) {
      editedServiceCode = editedServiceCode.replaceAll(key, String(value));
    }

    editedServiceCode = editedServiceCode.replaceAll(`customizedMessage.sendMail`, `sendMail`);
    editedServiceCode = editedServiceCode.replaceAll(`customizedMessage.sendNotification`, `sendNotification`);

    return editedServiceCode;
  }

  async sendMail(userEmail, email) {
    this.logger.log('Sending email with subject:', email.subject);
    return await this.mailService.sendEmailFromService(userEmail, email.body);
  }

  async sendNotification(userId: string, notification) {
    this.logger.log('Sending notification to userId:', userId);
    return await this.mailService.sendNotificationFromService(userId, notification.title, notification.message);
  }
}
