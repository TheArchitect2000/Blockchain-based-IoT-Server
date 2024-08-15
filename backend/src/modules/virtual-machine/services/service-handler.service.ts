import { Script, createContext } from 'vm';
import mqtt from 'mqtt';
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
    private readonly deviceService?: DeviceService,
  ) {
    if (VirtualMachineHandlerService.instance) {
      return VirtualMachineHandlerService.instance;
    }
    VirtualMachineHandlerService.instance = this;
    setTimeout(() => {
      this.createAllVirtualMachines()
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

    let userCode = body.code.toString();

    let serviceOutPut = userCode.toString().replaceAll(/\r?\n|\r/g, ' ');

    let editedUserCodeOutput = serviceOutPut;

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      'MULTI_SENSOR_1',
      'data.data',
    );

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      `customizedMessage.sendMail`,
      `sendMail`,
    );

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      `customizedMessage.sendNotification`,
      `sendNotification`,
    );

    let userId = body.userId;

    const code = `
            const {
                Worker,
                isMainThread,
                parentPort,
                workerData,
            } = require("worker_threads");
    
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
                  // Check if the value is a string
                  if (typeof value === 'string') {
                    // Lowercase the string
                    obj[key] = value.toLowerCase();
                  } else if (typeof value === 'object') {
                    // Recursively call lowercaseStrings if the value is an object
                    lowercaseStrings(value);
                  }
                }
              }
              return obj;
            }
    
                const connectUrl = "mqtts://${process.env.HOST_NAME_OR_IP}:8883";
    
                // Create a shared buffer with 2048 bytes
                const sharedBuffer = new SharedArrayBuffer(2048);
                const view = new DataView(sharedBuffer);
    
                let topic = "${body.deviceMap.MULTI_SENSOR_1}";
                const client = mqtt.connect(connectUrl, {
                    clean: true,
                    connectTimeout: 4000,
                    reconnectPeriod: 1000,
                    protocolId: "MQIsdp",
                    protocolVersion: 3,
                });
    
                function terminateVm() {
                  view.setUint8(1, 1);
                  client.end(false, () => {
                    console.log('Disconnected from MQTT broker');
                  });
                  return true;
                }
              
                // Expose the function to the context
                globalThis.terminateVm = terminateVm;
    
                client.on("connect", () => {
                    client.subscribe(topic, (err) => {
                        if (!err) {
                            console.log("Connected To :", topic);
                        } else {
                            console.log("Error While Connecting To :", topic);
                        }
                    });
                });
    
                async function getDeviceInfos(ecryptedId) {
                  const respons = await deviceService.getDeviceInfoByEncryptedId(ecryptedId)
                  return respons
                }
    
                 client.on("message", async (topic, message) => {
    
                  let data = JSON.parse(message);
    
                  try {
                    const deviceInfos = await getDeviceInfos(topic);
    
                    if (deviceInfos) {
                        data.data = {
                            ...data.data, 
                            mac: deviceInfos.mac,
                            name: deviceInfos.deviceName,
                            type: deviceInfos.deviceType
                        };
            
                        data.data = uppercaseKeys(data.data);
                        data.data = lowercaseStrings(data.data);
            
                        console.log("The data is:", data);
                    } else {
                        console.error("Device info not found for topic:", topic);
                    }
                  } catch (error) {
                      console.error("Error fetching device info:", error);
                  }

                    // Clear the sharedBuffer before setting new data
                    for (let i = 0; i < sharedBuffer.byteLength; i++) {
                        view.setUint8(i, 0);
                    }
    
                    // Encode the message and store it in sharedBuffer
                    const encoder = new TextEncoder();
                    const encodedMessage = encoder.encode(JSON.stringify(data));
                    for (let i = 0; i < encodedMessage.length; i++) {
                        view.setUint8(i + 2, encodedMessage[i]);  // Store starting from index 1
                    }
                    // Set the flag to true (1)
                    view.setUint8(0, 1);
                }); 
    
                console.log("Main thread: Starting workers...");
    
                const sendMail = async (email) => {
                  let user = await userService.getUserProfileByIdFromUser('${userId}');
                  let userEmail = user.email;
                  return await mailService.sendEmailFromService(userEmail, email.body, email.subject);
                }
    
                const sendNotification = async (notification) => {
                  return await mailService.sendNotificationFromService('${userId}', notification.title, notification.message);
                }
    
                const workerCode = \`
    
                const {
                  Worker,
                  isMainThread,
                  parentPort,
                  workerData,
                } = require("worker_threads");
      
                const { TextEncoder, TextDecoder } = require('util');
    
                function mainFunction() {
                  const sharedBuffer = workerData;
                  const view = new DataView(sharedBuffer);
                  const decoder = new TextDecoder();
                  parentPort.postMessage("Loop Runed")
    
                  while (true) {
                      const flag = view.getUint8(0);
                      const terminate = view.getUint8(1);
                      if (terminate === 1) {
                        process.exit(0);
                      }
                      if (flag === 1) {
                          // Reset the flag
                          view.setUint8(0, 0);
    
                          // Extract and decode the message starting from index 1
                          const bytes = new Uint8Array(sharedBuffer, 2, 2046);
                          
                          let message = decoder.decode(bytes).trim();
                      
                          // Log the exact content of the message
                          console.log('Decoded message:', message);
    
                          // Clean up the message by removing any non-JSON residual characters
                          const cleanMessage = message.replace(/[^\\x20-\\x7E]/g, '');
    
                          // Parse the JSON message
    
                          const sendMail = (obj) => {
                            parentPort.postMessage(obj);
                          };
    
                          const sendNotification = (obj) => {
                            parentPort.postMessage(obj);
                          };
                          
                          parentPort.postMessage("clean Message ISSSSSS: ");
                          parentPort.postMessage(cleanMessage)

                          try {
                            let data = JSON.parse(cleanMessage);
                            parentPort.postMessage("Data Parsed");
                            parentPort.postMessage(data);
    
                            ${editedUserCodeOutput}
    
                          } catch (e) {
                              parentPort.postMessage('Failed to parse JSON: ');
                              parentPort.postMessage(e);
                          }
    
                      }
    
                      // Simulate a short delay
                      var waitTill = new Date(new Date().getTime() + 100);
                      while (waitTill > new Date()) {}
                  }
              }
    
              mainFunction();\`
    
                const vmWorker = new Worker(workerCode, { eval: true, workerData: sharedBuffer });
    
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
      userService: this.userService,
      mailService: this.mailService,
      deviceService: this.deviceService,
      JSON: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
      TextEncoder: require('util').TextEncoder,
      TextDecoder: require('util').TextDecoder,
    });

    // Run the script in the context
    script.runInContext(context);

    this.vmContexts[installedServiceId.toString()] = context;

    console.log(
      `Virtual Machine With ID ${installedServiceId} Created Successfully`,
    );

    return true
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
    let count = 0
    await this.installedServiceService
      .getAllInstalledServices()
      .then((data) => {
        data.map((service) => {
          if (service.code) {
            this.createVirtualMachine(service, service._id);
            count = count + 1
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
