import { Script, createContext } from 'vm';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailService } from 'src/modules/utility/services/mail.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';

@Injectable()
export class VirtualMachineHandlerService {
  private static instance: VirtualMachineHandlerService;
  private vmContexts = {};
  private allResults;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService?: UserService,
    @Inject(forwardRef(() => InstalledServiceService))
    private readonly installedServiceService?: InstalledServiceService,
    private readonly mailService?: MailService,
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService?: DeviceService,
  ) {
    if (VirtualMachineHandlerService.instance) {
      return VirtualMachineHandlerService.instance;
    }
    VirtualMachineHandlerService.instance = this;
    setTimeout(() => {
      this.createAllVirtualMachines();
    }, 5000);
  }

  async isVmExist(installedServiceId) {
    if (this.vmContexts[installedServiceId.toString()]) {
      return true;
    } else {
      return false;
    }
  }

  async createVirtualMachine(body, installedServiceId) {
    const isExist = await this.isVmExist(installedServiceId);
    if (isExist === true) {
      console.log('VM with this installedServiceId is created before!');
      return false;
    }

    const localDeviceMap = body.deviceMap;
    const userId = body.userId;
    let userCode = body.code.toString();

    userCode = this.sanitizeUserCode(userCode);

    const { letLinesCode, restOfCode } = this.parseUserCode(userCode);

    const mainThreadCode = this.generateMainThreadCode(
      localDeviceMap,
      userId,
      installedServiceId,
    );

    const script = new Script(mainThreadCode);

    const context = createContext({
      console: console,
      require: require,
      mqtt: require('mqtt'),
      localDeviceMap: localDeviceMap,
      userService: this.userService,
      mailService: this.mailService,
      deviceService: this.deviceService,
      userId: userId,
      userCode: {
        letLines: letLinesCode,
        restOfCode: restOfCode,
      },
      installedServiceId: installedServiceId,
      JSON: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
      TextEncoder: require('util').TextEncoder,
      TextDecoder: require('util').TextDecoder,
      setTimeout: setTimeout,
      setInterval: setInterval,
    });

    // Run the script in the context
    script.runInContext(context);

    // Store context
    this.vmContexts[installedServiceId.toString()] = context;

    console.log(
      `Virtual Machine With ID ${installedServiceId} Created Successfully`,
    );

    return true;
  }

  sanitizeUserCode(userCode) {
    // Replace custom functions with safe equivalents
    userCode = userCode.replaceAll('customizedMessage.sendMail', 'sendMail');
    userCode = userCode.replaceAll(
      'customizedMessage.sendNotification',
      'sendNotification',
    );

    // Add getNewData function into loops for data refreshing
    userCode = userCode.replace(
      /(for\s*\(.*?\)\s*\{)|(while\s*\(.*?\)\s*\{)/g,
      (match) =>
        `${match}\n    getNewData();var waitTill = new Date(new Date().getTime() + 200);while (waitTill > new Date()) {};`,
    );

    userCode = userCode.replace(
      /await waitForDevicePayload\(([\w\d_]+)\);/g,
      'while (getNewData("$1") == false) {parentPort.postMessage("Looping"); var waitTill = new Date(new Date().getTime() + 500);while (waitTill > new Date()) {}}; parentPort.postMessage("Device sent data and exited loop");',
    );

    let waitCounter = 0;
    userCode = userCode.replace(
      /await waitTill\((\w+)\);( ?\/\/.*)?/g,
      (match, group1) => {
        waitCounter++;
        return `let waitTill_${waitCounter} = new Date(new Date().getTime() + ${group1});while (waitTill_${waitCounter} > new Date()) {}`;
      },
    );

    return userCode;
  }

  parseUserCode(userCode) {
    const lines = userCode.split('\n');
    const letLinesCode = lines
      .filter((line) => line.trim().startsWith('let '))
      .join('\n');
    const restOfCode = lines
      .filter((line) => !line.trim().startsWith('let '))
      .join('\n');

    return { letLinesCode, restOfCode };
  }

  generateMainThreadCode(localDeviceMap, userId, installedServiceId) {
    return `
const { Worker } = require('worker_threads');
const { TextEncoder, TextDecoder } = require('util');

// ============================================
// UTILITY FUNCTIONS
// ============================================
function uppercaseKeys(obj) {
  return Object.keys(obj).reduce((result, key) => {
    result[key.toUpperCase()] = obj[key];
    return result;
  }, {});
}

function lowercaseStrings(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        obj[key] = value.toLowerCase();
        lowercaseStrings(value);
      }
    }
  }
  return obj;
}

let devicesInfo = {};

async function getServiceDevicesData() {
  devicesInfo = {};

  for (const [deviceName, deviceEncryptedId] of Object.entries(localDeviceMap)) {
    devicesInfo[deviceName] = await deviceService.getDeviceInfoByEncryptedId(
      String(deviceEncryptedId)
    );
  }

  Object.keys(devicesInfo).forEach((key) => {
    const deviceData = devicesInfo[key];
    let nodeMqttAddress = '';

    if (String(deviceData.nodeId) === 'developer.fidesinnova.io') {
      nodeMqttAddress = deviceData.nodeId;
    } else {
      nodeMqttAddress = 'panel.' + deviceData.nodeId;
    }
    devicesInfo[key].nodeMqttAddress = nodeMqttAddress;
  });

  console.log('All Device Data Refreshed From DB');
}

function getDeviceVariableWithEncryptedId(deviceEncryptedId) {
  let findName = '';
  for (const [deviceName, encryptedId] of Object.entries(localDeviceMap)) {
    if (String(deviceEncryptedId) === String(encryptedId)) {
      findName = deviceName;
    }
  }
  return findName;
}

function getDeviceDataByEncryptedId(deviceEncryptedId) {
  const deviceData = Object.keys(devicesInfo).find((key) => {
    const deviceData = devicesInfo[key];
    return String(deviceData.deviceEncryptedId) === String(deviceEncryptedId);
  });
  return devicesInfo[deviceData] || {};
}

const sharedBuffer = new SharedArrayBuffer(2048);
const view = new DataView(sharedBuffer);
let clients = [];

function listenToAllDevices() {
  Object.keys(devicesInfo).forEach((key) => {
    const deviceData = devicesInfo[key];
    const connectUrl = 'mqtts://' + deviceData.nodeMqttAddress + ':8883';
    let topic = deviceData.deviceEncryptedId;

    const client = mqtt.connect(connectUrl, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      protocolId: 'MQIsdp',
      protocolVersion: 3,
    });

    clients.push(client);

    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log('Connected To:', topic);
        } else {
          console.log('Error While Connecting To:', topic);
        }
      });
    });

    client.on('message', async (topic, message) => {
      let data = JSON.parse(message);

      try {
        const deviceInfos = getDeviceDataByEncryptedId(data.from);
        console.log('Device Name:', deviceInfos.deviceName, ', Device Enc:', data.from);

        if (deviceInfos) {
          data.variable = getDeviceVariableWithEncryptedId(data.from);
          data.data = {
            ...data.data,
            mac: deviceInfos.mac,
            type: deviceInfos.deviceType,
          };

          if (data.data.proof) {
            delete data.data.proof;
            console.log('Proof Deleted');
          }

          data.data = lowercaseStrings(data.data);
          data.data.name = deviceInfos.deviceName;
          data.data = uppercaseKeys(data.data);
        } else {
          console.error('Device info not found for topic:', topic);
        }
      } catch (error) {
        console.error('Error fetching device info:', error);
      }

      // Clear the sharedBuffer before setting new data
      for (let i = 0; i < sharedBuffer.byteLength; i++) {
        view.setUint8(i, 0);
      }

      // Encode the message and store it in sharedBuffer
      const encoder = new TextEncoder();
      const encodedMessage = encoder.encode(JSON.stringify(data));
      for (let i = 0; i < encodedMessage.length; i++) {
        view.setUint8(i + 2, encodedMessage[i]);
      }

      console.log('Flag set to true');
      view.setUint8(0, 1);
    });
  });
}

function terminateVm() {
  view.setUint8(1, 1);

  clients.forEach((client) => {
    client.end(false, () => {
      console.log('Disconnected from MQTT broker');
    });
  });

  return true;
}

globalThis.terminateVm = terminateVm;

const sendMail = async (email) => {
  try {
    let user = await userService.getUserProfileByIdFromUser(userId);
    let userEmail = user.email;
    return await mailService.sendEmailFromService(
      userEmail,
      email.body,
      email.subject
    );
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
};

const sendNotification = async (notification) => {
  try {
    return await mailService.sendNotificationFromService(
      userId,
      notification.title,
      notification.message
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

console.log('Main thread: Starting workers...');

const vmWorker = new Worker(__dirname + '/worker-executor.js', {
  workerData: {
    sharedBuffer: sharedBuffer,
    userCode: userCode, // From context variable
  }
});

vmWorker.on('message', (msg) => {
  if (typeof msg === 'object' && msg !== null) {
    if (msg.subject) {
      sendMail(msg).catch(err => console.error('Mail error:', err));
    } else if (msg.title) {
      sendNotification(msg).catch(err => console.error('Notification error:', err));
    }
  }
  console.log('Main thread: Received from worker:', msg);
});

vmWorker.on('error', (err) => {
  console.error('Worker encountered an error:', err);
});

vmWorker.on('exit', (code) => {
  if (code !== 0) {
    console.error('Worker stopped with exit code', code);
  } else {
    console.log('Worker exited successfully.');
  }
});

console.log('vmWorker started successfully.');

(async () => {
  await getServiceDevicesData();
  await listenToAllDevices();
})();

setTimeout(() => {
  getServiceDevicesData();
}, 10 * 60 * 1000);
`;
  }

  async deleteVirtualMachinByServiceId(installedServiceId) {
    console.log('Deletingggggggggg');

    try {
      if (this.vmContexts[installedServiceId.toString()]) {
        this.vmContexts[installedServiceId.toString()].terminateVm();
        delete this.vmContexts[installedServiceId.toString()];
        console.log(
          `${installedServiceId} Virtual Machine Deleted Succesfully !`,
        );
      }
      return true;
    } catch (e) {
      console.log('Errrrorrrrr:', e);

      return false;
    }
  }

  async deleteAllUserVirtualMachines(userId: string) {
    await this.installedServiceService
      .getInstalledServicesByUserId(userId)
      .then((data) => {
        data.map((service) => {
          this.deleteVirtualMachinByServiceId(service._id.toString());
        });
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services!';
        return errorMessage;
      });

    return true;
  }

  async createAllVirtualMachines() {
    let count = 0;
    await this.installedServiceService
      .getAllInstalledServices()
      .then((data) => {
        data.map((service) => {
          if (service.code) {
            this.createVirtualMachine(service, service._id);
            count = count + 1;
          }
        });
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services!';
        return errorMessage;
      });
    console.log(`All virtual machines created successfully (Count: ${count})`);

    return this.allResults;
  }
}
