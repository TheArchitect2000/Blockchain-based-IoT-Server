import { Script, createContext } from 'vm';
import mqtt from 'mqtt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailService } from 'src/modules/utility/services/mail.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { insertInstalledServiceDto } from 'src/modules/service/data-transfer-objects/insert-installed-service.dto';
import { Device } from 'src/modules/device/interfaces/device.interface';

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
    if (isExist == true) {
      console.log('Vm with this installedServiceId is created before !');
      return false;
    }

    const localDeviceMap = body.deviceMap;

    let userCode = body.code.toString();

    // replacing custom functions with blockly functions
    userCode = userCode.replaceAll(`customizedMessage.sendMail`, `sendMail`);
    userCode = userCode.replaceAll(
      `customizedMessage.sendNotification`,
      `sendNotification`,
    );

    // adding getNewData function into first line of all while and for loops ( for data refreshing every where )
    userCode = userCode.replace(
      /(for\s*\(.*?\)\s*\{)|(while\s*\(.*?\)\s*\{)/g,
      (match) =>
        `${match}\n    getNewData();var waitTill = new Date(new Date().getTime() + 200);while (waitTill > new Date()) {};`,
    );

    // replacing waitForDevicePayload with acctual backend codes
    userCode = userCode.replace(
      /await waitForDevicePayload\(([\w\d_]+)\);/g,
      'while (getNewData("$1") == false) {parentPort.postMessage("Looping"); var waitTill = new Date(new Date().getTime() + 500);while (waitTill > new Date()) {}}; parentPort.postMessage("Device sended data and exited loop");',
    );

    // replacing blockly wait function with while loops
    let waitCounter = 0;
    userCode = userCode.replace(/await waitTill\((\w+)\);( ?\/\/.*)?/g, () => {
      waitCounter++;
      return `let waitTill_${waitCounter} = new Date(new Date().getTime() + $1);while (waitTill_${waitCounter} > new Date()) {}`;
    });

    const lines = userCode.split('\n');
    const letLinesCode = lines
      .filter((line) => line.startsWith('let '))
      .join('\n');
    const restOfCode = lines
      .filter((line) => !line.startsWith('let '))
      .join('\n');

    let userId = body.userId;

    console.log(
      '---------------------------------------------------------------------------',
    );

    console.log('1 code:', userCode);

    console.log(
      '---------------------------------------------------------------------------',
    );

    console.log('2 code:', letLinesCode);

    console.log(
      '---------------------------------------------------------------------------',
    );

    console.log('3 code:', restOfCode);

    console.log(
      '---------------------------------------------------------------------------',
    );

    const code = `
    const {
	Worker,
	isMainThread,
	parentPort,
	workerData,
} = require('worker_threads');

const { TextEncoder, TextDecoder } = require('util');

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

	for (const [deviceName, deviceEncryptedId] of Object.entries(
		localDeviceMap
	)) {
		devicesInfo[deviceName] =
			await deviceService.getDeviceInfoByEncryptedId(
				String(deviceEncryptedId)
			);
	}

	Object.keys(devicesInfo).forEach((key) => {
		const deviceData = devicesInfo[key];

		let nodeMqttAddress = '';

		if (String(deviceData.nodeId) == 'developer.fidesinnova.io') {
			nodeMqttAddress = \`\${deviceData.nodeId}\`;
		} else {
			nodeMqttAddress = \`panel.\${deviceData.nodeId}\`;
		}
		devicesInfo[key].nodeMqttAddress = nodeMqttAddress;
	});

	console.log('All Device Data Refreshed From DB');
}

function getDeviceVariableWithEncryptedId(deviceEncryptedId) {
	let findName = '';
	for (const [deviceName, encryptedId] of Object.entries(localDeviceMap)) {
		if (String(deviceEncryptedId) == String(encryptedId)) {
			findName = deviceName;
		}
	}
	return findName;
}

function getDeviceDataByEncryptedId(deviceEncryptedId) {
	const deviceData = Object.keys(devicesInfo).find((key) => {
		const deviceData = devicesInfo[key];
		return (
			String(deviceData.deviceEncryptedId) === String(deviceEncryptedId)
		);
	});

	return devicesInfo[deviceData] || {};
}

const sharedBuffer = new SharedArrayBuffer(2048);
const view = new DataView(sharedBuffer);

let clients = [];

function listenToAllDevices() {
	Object.keys(devicesInfo).forEach((key) => {
		const deviceData = devicesInfo[key];
		const connectUrl = \`mqtts://\${deviceData.nodeMqttAddress}:8883\`;
		let topic = \`\${deviceData.deviceEncryptedId}\`;
		
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
					console.log('Connected To :', topic);
				} else {
					console.log('Error While Connecting To :', topic);
				}
			});
		});
		client.on('message', async (topic, message) => {
			let data = JSON.parse(message);

			try {
				const deviceInfos = getDeviceDataByEncryptedId(data.from);

        		console.log("Device Name:", deviceInfos.deviceName, ", Device Enc:", data.from)

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

				data.data.name = deviceInfos.deviceName // Because of the device name to don't be lowercase*

				data.data = uppercaseKeys(data.data); // uppercasing all the keys, also NAME*

				console.log('The data is:', data);
          
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
				view.setUint8(i + 2, encodedMessage[i]); // Store starting from index 1
			}

			console.log("Flag setted true")
			// Set the flag to true (1)
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

(async () => {
	await getServiceDevicesData();
	await listenToAllDevices();
})();

setTimeout(() => {
	getServiceDevicesData();
}, 10 * 60 * 1000);

// Expose the function to the context
globalThis.terminateVm = terminateVm;

const sendMail = async (email) => {
	let user = await userService.getUserProfileByIdFromUser('${userId}');
	let userEmail = user.email;
	return await mailService.sendEmailFromService(
		userEmail,
		email.body,
		email.subject
	);
};

const sendNotification = async (notification) => {
	return await mailService.sendNotificationFromService(
		'${userId}',
		notification.title,
		notification.message
	);
};


console.log('Main thread: Starting workers...');


    const workerCode = \`
     const {
	Worker,
	isMainThread,
	parentPort,
	workerData,
} = require('worker_threads');

const { TextEncoder, TextDecoder } = require('util');

let lastData = {};
let functions = {};



function getNewData(variable = "") {
	const sharedBuffer = workerData;
	const view = new DataView(sharedBuffer);
	const decoder = new TextDecoder();
	const flag = view.getUint8(0);
	const terminate = view.getUint8(1);
	if (terminate === 1) {
		process.exit(0);
	}

	if (flag === 1) {

		parentPort.postMessage("Data received from custom function")

		view.setUint8(0, 0);

		const bytes = new Uint8Array(sharedBuffer, 2, 2046);

		let message = decoder.decode(bytes).trim();

		const cleanMessage = message.replace(/[^\\x20-\\x7E]/g, '');

		let data;

		try {

			data = JSON.parse(cleanMessage);

    		lastData[String(data.variable)] = data.data

			const deviceName = String(data.variable);
			const capitalizedDeviceName = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);
			
			const functionName = "runFunctionWithPayload" + capitalizedDeviceName;

			if (typeof functions[functionName] === "function") {
				functions[functionName]();
			} else {
				console.error("Function not found");
			}

		} catch (e) {
			parentPort.postMessage('Failed to parse JSON');
		}

		const deviceVar = String(variable)

		parentPort.postMessage("The variable is:")

		parentPort.postMessage(deviceVar)

		if ( deviceVar.length > 0 && deviceVar != String(data?.variable) ) {
			parentPort.postMessage("getNewData returned falseeeeeeeeeeeeee")
			return false
		}
		parentPort.postMessage("getNewData returned truuuuuuuuuuuuuuuuuuuuue")
		return true
	} else {
		return false 
	}
}

function mainFunction() {
	const sharedBuffer = workerData;
	const view = new DataView(sharedBuffer);
	const decoder = new TextDecoder();
	parentPort.postMessage('Loop Runed');
  	
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

			const cleanMessage = message.replace(/[^\\x20-\\x7E]/g, '');

			const sendMail = (obj) => {
				parentPort.postMessage(obj);
			};

			const sendNotification = (obj) => {
				parentPort.postMessage(obj);
			};

			try {

				let data = JSON.parse(cleanMessage);

        		lastData[String(data.variable)] = data.data

				${letLinesCode}

				parentPort.postMessage('Log lastData:');
				parentPort.postMessage(lastData);

				${restOfCode}

				const deviceName = String(data.variable);
				const capitalizedDeviceName = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);
				
				const functionName = "runFunctionWithPayload" + capitalizedDeviceName;

				if (typeof functions[functionName] === "function") {
					functions[functionName]();
				} else {
					console.error("Function not found");
				}
        
			} catch (e) {
				parentPort.postMessage('Error in user code: ');
				parentPort.postMessage(e);
			}
		}

		// Simulate a short delay
		var waitTill = new Date(new Date().getTime() + 100);while (waitTill > new Date()) {};
	}

	
}

mainFunction();

    \`

    const vmWorker = new Worker(workerCode, { eval: true, workerData: sharedBuffer});
    
                vmWorker.on('message', (msg) => {
                    if ( (typeof msg).toString() === "object" ) {
                      if ( msg.subject ) {
                        sendMail(msg)
                      } else if ( msg.title ) {
                        sendNotification(msg)
                      }
                    }
                    console.log('Main thread: Received from worker: ', msg);
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
    `;

    // Create a script
    const script = new Script(code);

    // Create a context for the script to run in
    const context = createContext({
      console: console,
      require: require,
      mqtt: mqtt,
      localDeviceMap: localDeviceMap,
      userService: this.userService,
      mailService: this.mailService,
      deviceService: this.deviceService,
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

    this.vmContexts[installedServiceId.toString()] = context;

    console.log(
      `Virtual Machine With ID ${installedServiceId} Created Successfully`,
    );

    return true;
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


