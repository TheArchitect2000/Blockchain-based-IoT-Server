import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
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
          // console.log(`\x1b[33m \nThe device ${deviceEncryptedId} has installed service! ${data}\x1b[0m`);
          let installedService = this.result;
          
          // Remove new line \n character from string.
          for(var i=0; i < installedService.length; i++){
            let installedServiceOutput = JSON.stringify(installedService[i]).replaceAll(
              /\r?\n|\r/g,
              ' ',
            );
          // console.log(`\x1b[31m \nThe device ${installedService} has installed service! ${data}\x1b[0m`);
            let parsedInstalledService = JSON.parse(installedServiceOutput);
          // console.log(`\x1b[32m \nInstalled service code is: ${parsedInstalledService.code} \x1b[0m`);
          //   this.runInstalledService(installedService);
            
            const deviceInfos: any = await this.deviceService.getDeviceInfoByEncryptedId(deviceEncryptedId)
            console.log("Deviceeeeeeeeee Infoooooooos:", deviceInfos);
            
            parsedPayload.data = {...parsedPayload.data, mac: deviceInfos.mac, name: deviceInfos.deviceName, type: deviceInfos.deviceType}
            
            await this.runServiceCode(parsedInstalledService, parsedPayload);
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

  async runServiceCode(parsedInstalledService, parsedPayload) {
    let userId = parsedInstalledService.userId;
    let user = await this.userService.getUserProfileByIdFromUser(userId);
    let userEmail = user.email;
    console.log(`\x1b[33m \nUser email is: ${userEmail} \x1b[0m`);
    let parsedInstalledServiceCode = parsedInstalledService.code;
    console.log(
      `\x1b[33m \nRunning installed service... \nService code is: ${parsedInstalledServiceCode} \x1b[0m`,
    );
    console.log(`\x1b[33m \nParsed payload is:\x1b[0m`, parsedPayload);
    /**
     * Device data formats:
     * "Movement": "Scanning...", "Detected"
     * "Door": "Open", "Close"
     * "Button": "Pressed", "Double", "Triple"
     */
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
    console.log(`\x1b[33m \device name is:\x1b[0m`, deviceName);
    let editedParsedInstalledServiceCode = ``;

    if (parsedInstalledServiceCode.includes("MULTI_SENSOR_1.MAC")) {
      editedParsedInstalledServiceCode = parsedInstalledServiceCode.replaceAll(
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
        console.log(`\x1b[33m \nDoor is open\x1b[0m`);
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.DOOR.OPENED`,
          String(true),
        );
        console.log(
          `\x1b[33m \neditedParsedInstalledServiceCode is:\x1b[0m`,
          editedParsedInstalledServiceCode,
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

    if (parsedInstalledServiceCode.includes(`MULTI_SENSOR_1.BUTTON`)) {
      if (button == 'Pressed') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.BUTTON.PRESSED`,
          "true",
        );
      } else if (button == 'Double') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.BUTTON.DOUBLE_PRESSED`,
          "true",
        );
      } else if (button == 'Triple') {
        editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
          `MULTI_SENSOR_1.BUTTON.TRIPLE_PRESSED`,
          "true",
        );
      }
    }

    console.log(
      `\x1b[33m \neditedParsedInstalledServiceCode is:\x1b[0m`,
      editedParsedInstalledServiceCode,
    );

    const isolate = new ivm.Isolate({ memoryLimit: 128 }); // The default is 128MB and the minimum is 8MB.
    const context = isolate.createContextSync();
    const jail = context.global;
    // jail.setSync("global", jail.derefInto());
    /* jail.setSync('customizedMessage.sendMail', function(...args) {
            this.sendMail(...args);
        }); */
    editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
      `customizedMessage.sendMail`,
      `sendMail`,
    );
    
    editedParsedInstalledServiceCode = editedParsedInstalledServiceCode.replaceAll(
      `customizedMessage.sendNotification`,
      `sendNotification`,
    );
    console.log(
      `\x1b[33m \neditedParsedInstalledServiceCode is:\x1b[0m`,
      editedParsedInstalledServiceCode,
    );
    /* jail.setSync('sendMail', function(...args) {
            this.sendMail(...args);
        }); */

    jail.setSync('sendMail', (emailJson) => {
      this.sendMail(userEmail, emailJson);
    });
    
    jail.setSync('sendNotification', (notificationJson) => {
      this.sendNotification(userId, notificationJson);
    });

    /* jail.setSync('sendMail', new ivm.Reference(function(...args) {
            // this.sendMail(...args);
        }));
 */
    try {
      /* const evaluation = await context.evalSync(
                `(function() { ${editedParsedInstalledServiceCode} })()`
            );
            console.log("\x1b[33m \nevaluation: \x1b[0m", await evaluation); */
      await context.evalSync(
        `(function() { ${editedParsedInstalledServiceCode} })()`,
      );
    } catch (e) {
      console.log(e);
    }

    jail.setSync('global', jail.derefInto());
    try {
      await context.evalClosureSync(`global._var1 = 50;`);
      // await context.evalClosureSync(`global._var1 = ${counts};`);
      const result = await context.evalSync('(function() { return _var1 })()');
      console.log('result: ', await result);
    } catch (e) {}

    isolate.dispose();
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
