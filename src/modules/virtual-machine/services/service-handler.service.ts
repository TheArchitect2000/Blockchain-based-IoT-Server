import { Injectable } from '@nestjs/common';
import * as ivm from 'isolated-vm';
import { DeviceService } from 'src/modules/device/services/device.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { MailService } from 'src/modules/utility/services/mail.service';

/**
 * Service Handler service.
 */

@Injectable()
export class ServiceHandlerService {
  private result;
  private vmMap: Map<string, ivm.Isolate> = new Map();

  constructor(
    private readonly userService?: UserService,
    private readonly installedServiceService?: InstalledServiceService,
    private readonly mailService?: MailService,
    private readonly deviceService?: DeviceService
  ) {}

  async runInstalledService(deviceEncryptedId, parsedPayload) {
    await this.installedServiceService
      .getInstalledServicesByDeviceEncryptedId(deviceEncryptedId)
      .then(async (data) => {
        this.result = data;
        if (data != undefined && data != null && data.length != 0) {
          let installedService = this.result;

          for (var i = 0; i < installedService.length; i++) {
            let installedServiceOutput = JSON.stringify(installedService[i]).replaceAll(
              /\r?\n|\r/g,
              ' ',
            );
            let parsedInstalledService = JSON.parse(installedServiceOutput);

            const deviceInfos: any = await this.deviceService.getDeviceInfoByEncryptedId(deviceEncryptedId);
            console.log("Device Info:", deviceInfos);

            parsedPayload.data = {
              ...parsedPayload.data,
              mac: deviceInfos.mac,
              name: deviceInfos.deviceName,
              type: deviceInfos.deviceType
            };

            await this.runServiceCode(deviceEncryptedId, parsedInstalledService, parsedPayload);
          }
        }
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage + error,
        );
      });
  }

  async runServiceCode(deviceEncryptedId, parsedInstalledService, parsedPayload) {
    // Check if there's an existing VM for the device and destroy it
    if (this.vmMap.has(deviceEncryptedId)) {
      const existingVm = this.vmMap.get(deviceEncryptedId);
      existingVm.dispose();
      this.vmMap.delete(deviceEncryptedId);
    }

    let userId = parsedInstalledService.userId;
    let user = await this.userService.getUserProfileByIdFromUser(userId);

    let userEmail = user.email;
    console.log(`\x1b[33m \nUser email is: ${userEmail} \x1b[0m`);
    let parsedInstalledServiceCode = parsedInstalledService.code;
    console.log(
      `\x1b[33m \nRunning installed service... \nService code is: ${parsedInstalledServiceCode} \x1b[0m`,
    );
    console.log(`\x1b[33m \nParsed payload is:\x1b[0m`, parsedPayload);
    
    let temperature = parsedPayload.data.Temperature;
    let humidity = parsedPayload.data.Humidity;
    let movement = parsedPayload.data.Movement;
    let door = parsedPayload.data.Door;
    let button = parsedPayload.data.Button;
    let deviceName = parsedPayload.data.name;
    let deviceMac = parsedPayload.data.mac;
    let deviceType = parsedPayload.data.type;
    
    console.log(`\x1b[33m \ntemperature is:\x1b[0m`, temperature);
    console.log(`\x1b[33m \nhumidity is:\x1b[0m`, humidity);
    console.log(`\x1b[33m \ndoor is:\x1b[0m`, door);
    console.log(`\x1b[33m \nmovement is:\x1b[0m`, movement);
    console.log(`\x1b[33m \nbutton is:\x1b[0m`, button);
    console.log(`\x1b[33m \ndevice name is:\x1b[0m`, deviceName);

    let editedParsedInstalledServiceCode = parsedInstalledServiceCode;

    if (parsedInstalledServiceCode.includes("MULTI_SENSOR_1.MAC")) {
      editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
        "MULTI_SENSOR_1.MAC",
        deviceMac,
      );
    }

    if (parsedInstalledServiceCode.includes("MULTI_SENSOR_1.TYPE")) {
      editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
        "MULTI_SENSOR_1.TYPE",
        deviceType,
      );
    }

    if (parsedInstalledServiceCode.includes("MULTI_SENSOR_1.NAME")) {
      editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
        "MULTI_SENSOR_1.NAME",
        deviceName,
      );
    }

    if (parsedInstalledServiceCode.includes("MULTI_SENSOR_1.TEMPERATURE")) {
      editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
        "MULTI_SENSOR_1.TEMPERATURE",
        temperature,
      );
    }

    if (parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.HUMIDITY`)) {
      editedParsedInstalledServiceCode = String(editedParsedInstalledServiceCode).replaceAll(
        `MULTI_SENSOR_1.HUMIDITY`,
        humidity,
      );
    }

    if (parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.DOOR`)) {
      if (door == 'Open') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.DOOR.OPENED`,
          String(true),
        );
      } else if (door == 'Close') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.DOOR.CLOSED`,
          "true",
        );
      }
    }

    if (parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.MOTION`)) {
      if (movement == 'Scanning...') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.MOTION.UNDETECTED`,
          "true",
        );
      } else if (movement == 'Detected') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.MOTION.DETECTED`,
          "true",
        );
      }
    }

    if (parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.PRESSED`)||parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.NOT_PRESSED`)) {
      if (button == 'Pressed') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.PRESSED`,
          "true",
        );
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.NOT_PRESSED`,
          "false",
        );
      } else {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.NOT_PRESSED`,
          "true",
        );
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.PRESSED`,
          "false",
        );
      }
    }

    console.log(
      `\x1b[33m \neditedParsedInstalledServiceCode is:\x1b[0m`,
      editedParsedInstalledServiceCode,
    );

    editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
      `customizedMessage.sendMail`,
      `sendMail`,
    );
    
    editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
      `customizedMessage.sendNotification`,
      `sendNotification`,
    );

    const isolate = new ivm.Isolate({ memoryLimit: 128 }); // The default is 128MB and the minimum is 8MB.
    const context = isolate.createContextSync();
    const jail = context.global;
    
    console.log(
      `\x1b[33m \neditedParsedInstalledServiceCode is:\x1b[0m`,
      editedParsedInstalledServiceCode,
    );

    jail.setSync('sendMail', (emailJson) => {
      this.sendMail(userEmail, emailJson);
    });
    
    jail.setSync('sendNotification', (notificationJson) => {
      this.sendNotification(userId, notificationJson);
    });

    try {
      await context.evalClosure(
        `(async function() { ${editedParsedInstalledServiceCode} })()`,
      );
    } catch (e) {
      console.log(e);
    }

    jail.setSync('global', jail.derefInto());
    try {
      await context.evalClosureSync(`global._var1 = 50;`);
      const result = await context.evalSync('(function() { return _var1 })()');
      console.log('result: ', await result);
    } catch (e) {}

    // Save the new VM to the map
    this.vmMap.set(deviceEncryptedId, isolate);
  }

  async sendMail(userEmail, email) {
    console.log('email.subject: ', email.subject);
    console.log('email.body: ', email.body);
    return await this.mailService.sendEmailFromService(userEmail, email.body);
  }

  async sendNotification(userId, notification) {
    console.log('notification.title: ', notification.title);
    console.log('notification.message: ', notification.message);
    return await this.mailService.sendNotificationFromService(userId, notification.title, notification.message);
  }
}
