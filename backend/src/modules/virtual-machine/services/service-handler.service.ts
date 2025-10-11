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

    console.log('-----------------------------------------------------------');
    console.log('1 Full code:', userCode);
    console.log('-----------------------------------------------------------');
    console.log('2 Let lines:', letLinesCode);
    console.log('-----------------------------------------------------------');
    console.log('3 Rest of code:', restOfCode);
    console.log('-----------------------------------------------------------');

    const mainThreadCode = this.generateMainThreadCode();

    const script = new Script(mainThreadCode);

    const context = createContext({
      console: console,
      require: require,
      mqtt: require('mqtt'),
      localDeviceMap: localDeviceMap,
      userService: this.userService,
      mailService: this.mailService,
      deviceService: this.deviceService,
      userId: userId, // ✅ Passed as variable
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

  // ============================================
  // SANITIZE USER CODE FROM BLOCKLY
  // ============================================
  sanitizeUserCode(userCode: string): string {
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

    // Replace waitForDevicePayload with actual backend code
    userCode = userCode.replace(
      /await waitForDevicePayload\(([\w\d_]+)\);/g,
      'while (getNewData("$1") == false) {parentPort.postMessage("Looping"); var waitTill = new Date(new Date().getTime() + 500);while (waitTill > new Date()) {}}; parentPort.postMessage("Device sent data and exited loop");',
    );

    // Replace blockly wait function with while loops
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

  // ============================================
  // PARSE USER CODE INTO SECTIONS
  // ============================================
  parseUserCode(userCode: string): {
    letLinesCode: string;
    restOfCode: string;
  } {
    const lines = userCode.split('\n');
    const letLinesCode = lines
      .filter((line) => line.trim().startsWith('let '))
      .join('\n');
    const restOfCode = lines
      .filter((line) => !line.trim().startsWith('let '))
      .join('\n');

    return { letLinesCode, restOfCode };
  }

  // ============================================
  // GENERATE MAIN THREAD CODE (NO INJECTION)
  // ============================================
  generateMainThreadCode(): string {
    // All dynamic values are accessed from context variables
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

// ============================================
// DEVICE MANAGEMENT
// ============================================
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

// ============================================
// SHARED BUFFER COMMUNICATION
// ============================================
const sharedBuffer = new SharedArrayBuffer(2048);
const view = new DataView(sharedBuffer);
let clients = [];

// ============================================
// MQTT DEVICE LISTENERS
// ============================================
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

// ============================================
// VM TERMINATION
// ============================================
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

// ============================================
// SECURE MESSAGING FUNCTIONS
// ============================================
// ✅ SECURE: userId is accessed from context variable, not template string
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

// ============================================
// CREATE WORKER THREAD
// ============================================
console.log('Main thread: Starting workers...');

// ✅ SECURE: Worker code without template injection
const workerCode = \`
const { parentPort, workerData } = require('worker_threads');
const { TextDecoder } = require('util');

const sharedBuffer = workerData.sharedBuffer;
const userCode = workerData.userCode;

let lastData = {};
let functions = {};

// Safe context for user code
const safeContext = {
  lastData: lastData,
  functions: functions,
  console: {
    log: (...args) => parentPort.postMessage({ type: 'log', data: args }),
    error: (...args) => parentPort.postMessage({ type: 'error', data: args }),
  },
  sendMail: (obj) => {
    if (obj && typeof obj === 'object' && obj.subject && obj.body) {
      parentPort.postMessage({ ...obj });
    }
  },
  sendNotification: (obj) => {
    if (obj && typeof obj === 'object' && obj.title && obj.message) {
      parentPort.postMessage({ ...obj });
    }
  },
  parentPort: {
    postMessage: (msg) => parentPort.postMessage(msg)
  },
  Date: Date,
  Math: Math,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Array: Array,
  Object: Object,
};

function getNewData(variable = "") {
  const view = new DataView(sharedBuffer);
  const decoder = new TextDecoder();
  const flag = view.getUint8(0);
  const terminate = view.getUint8(1);
  
  if (terminate === 1) {
    process.exit(0);
  }

  if (flag === 1) {
    parentPort.postMessage("Data received from custom function");
    view.setUint8(0, 0);

    const bytes = new Uint8Array(sharedBuffer, 2, 2046);
    let message = decoder.decode(bytes).trim();
    const cleanMessage = message.replace(/[^\\\\x20-\\\\x7E]/g, '');

    let data;
    try {
      data = JSON.parse(cleanMessage);
      lastData[String(data.variable)] = data.data;
      safeContext.lastData = lastData;

      parentPort.postMessage('Log lastData:');
      parentPort.postMessage(lastData);

      const deviceName = String(data.variable);
      const capitalizedDeviceName = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);
      const functionName = "runFunctionWithPayload" + capitalizedDeviceName;

      if (typeof functions[functionName] === "function") {
        functions[functionName]();
      }
    } catch (e) {
      parentPort.postMessage('Failed to parse JSON');
    }

    const deviceVar = String(variable);
    if (deviceVar.length > 0 && deviceVar !== String(data?.variable)) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

safeContext.getNewData = getNewData;

function executeUserCode(letLines, restOfCode, data) {
  try {
    const userFunction = new Function(
      ...Object.keys(safeContext),
      'data',
      \\\`
      'use strict';
      \\\${letLines}
      \\\${restOfCode}
      \\\`
    );
    userFunction(...Object.values(safeContext), data);
  } catch (error) {
    parentPort.postMessage('Error in user code:');
    parentPort.postMessage({
      message: error.message,
      stack: error.stack
    });
  }
}

function initializeUserCode() {
  try {
    if (userCode.letLines) {
      const initFunction = new Function(
        ...Object.keys(safeContext),
        \\\`
        'use strict';
        \\\${userCode.letLines}
        \\\`
      );
      initFunction(...Object.values(safeContext));
    }
    parentPort.postMessage('User code initialized successfully');
  } catch (error) {
    parentPort.postMessage('Error initializing user code:');
    parentPort.postMessage({
      message: error.message,
      stack: error.stack
    });
  }
}

function mainFunction() {
  const view = new DataView(sharedBuffer);
  const decoder = new TextDecoder();
  
  parentPort.postMessage('Loop Started');
  
  while (true) {
    const flag = view.getUint8(0);
    const terminate = view.getUint8(1);
    
    if (terminate === 1) {
      process.exit(0);
    }

    if (flag === 1) {
      view.setUint8(0, 0);

      const bytes = new Uint8Array(sharedBuffer, 2, 2046);
      let message = decoder.decode(bytes).trim();
      const cleanMessage = message.replace(/[^\\\\x20-\\\\x7E]/g, '');

      try {
        let data = JSON.parse(cleanMessage);
        lastData[String(data.variable)] = data.data;
        safeContext.lastData = lastData;

        parentPort.postMessage('Log lastData:');
        parentPort.postMessage(lastData);

        if (userCode.restOfCode) {
          executeUserCode(userCode.letLines, userCode.restOfCode, data);
        }

        const deviceName = String(data.variable);
        const capitalizedDeviceName = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);
        const functionName = "runFunctionWithPayload" + capitalizedDeviceName;

        if (typeof functions[functionName] === "function") {
          functions[functionName]();
        }
      } catch (e) {
        parentPort.postMessage('Error processing device data:');
        parentPort.postMessage({
          message: e.message,
          stack: e.stack
        });
      }
    }

    const waitTill = new Date(new Date().getTime() + 100);
    while (waitTill > new Date()) {}
  }
}

try {
  initializeUserCode();
  mainFunction();
} catch (error) {
  parentPort.postMessage('Fatal worker error:');
  parentPort.postMessage({
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
}
\`;

// ✅ SECURE: Create worker with code string, pass user code as data
const vmWorker = new Worker(workerCode, {
  eval: true,
  workerData: {
    sharedBuffer: sharedBuffer,
    userCode: userCode, // ✅ From context variable, not template interpolation
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

// ============================================
// INITIALIZE
// ============================================
(async () => {
  await getServiceDevicesData();
  await listenToAllDevices();
})();

setTimeout(() => {
  getServiceDevicesData();
}, 10 * 60 * 1000);
`;
  }

  // ============================================
  // DELETE VIRTUAL MACHINE
  // ============================================
  async deleteVirtualMachinByServiceId(installedServiceId) {
    console.log('Deleting VM...');

    try {
      if (this.vmContexts[installedServiceId.toString()]) {
        this.vmContexts[installedServiceId.toString()].terminateVm();
        delete this.vmContexts[installedServiceId.toString()];
        console.log(
          `${installedServiceId} Virtual Machine Deleted Successfully!`,
        );
      }
      return true;
    } catch (e) {
      console.log('Error deleting VM:', e);
      return false;
    }
  }

  // ============================================
  // DELETE ALL USER VMS
  // ============================================
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
        console.error(errorMessage, error);
        return errorMessage;
      });

    return true;
  }

  // ============================================
  // CREATE ALL VMS ON STARTUP
  // ============================================
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
        console.error(errorMessage, error);
        return errorMessage;
      });
    console.log(`All virtual machines created successfully (Count: ${count})`);

    return this.allResults;
  }
}
