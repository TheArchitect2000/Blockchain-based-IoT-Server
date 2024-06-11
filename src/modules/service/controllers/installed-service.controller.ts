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
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { InstalledServiceService } from '../services/installed-service.service';
import { insertInstalledServiceDto } from '../data-transfer-objects/insert-installed-service.dto';
import { editInstalledServiceDto } from '../data-transfer-objects/edit-installed-service.dto';
import { Script, createContext } from 'vm';
import mqtt from 'mqtt';
import { MailService } from 'src/modules/utility/services/mail.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { DeviceService } from 'src/modules/device/services/device.service';

@ApiTags('Manage Installed Services')
@Controller('app')
export class InstalledServiceController {
  private vmContexts = {};
  private result;

  constructor(
    private readonly installedServiceService: InstalledServiceService,
    private readonly mailService?: MailService,
    private readonly userService?: UserService,
    private readonly deviceService?: DeviceService
  ) {}

  @Post('v1/installed-service/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Inserts a user installed service.',
    description:
      'This api requires installed service profile. Devices are array device Ids.',
  })
  async insertInstalledService(
    @Body() body: insertInstalledServiceDto,
    @Request() request,
  ) {

    let userCode = body.code.toString();

    let serviceOutPut = userCode.toString().replaceAll(
      /\r?\n|\r/g,
      ' ',
    );

    let editedUserCodeOutput = serviceOutPut;

    console.log( "Codeeeeee Issssssssssssssss ::::::::::::" , editedUserCodeOutput);

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      "MULTI_SENSOR_1",
      "data.data",
    );

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      `customizedMessage.sendMail`,
      `sendMail`,
    );

    editedUserCodeOutput = editedUserCodeOutput.replaceAll(
      `customizedMessage.sendNotification`,
      `sendNotification`,
    );

    console.log("Latest Code Edit Is : " , editedUserCodeOutput);
    
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
              return await mailService.sendEmailFromService(userEmail, email.body);
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
                      const bytes = new Uint8Array(sharedBuffer, 2, 1022);
                      
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
        this: this,
        userService: this.userService,
        mailService: this.mailService,
        deviceService: this.deviceService,
        JSON: {
          parse: JSON.parse,
          stringify: JSON.stringify,
        },
        TextEncoder: require("util").TextEncoder,
		    TextDecoder: require("util").TextDecoder,
      });
      
    // Run the script in the context
    script.runInContext(context);

    console.log("the object logggggg issssssssssssss:", this.vmContexts);

    const res = await this.installedServiceService.insertInstalledService(body);

    this.vmContexts[res._id.toString()] = context;

    return res;
  }

  @Patch('v1/installed-service/edit')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edites installed service.',
    description:
      'Edites installed service by installed service ID and other fields.',
  })
  async editInstalledService(
    @Body() body: editInstalledServiceDto,
    @Request() request,
  ) {
    console.log('We are in editService controller');

    if (
      body.installedServiceId === null ||
      body.installedServiceId === undefined ||
      body.installedServiceId === '' ||
      Types.ObjectId.isValid(String(body.installedServiceId)) === false
    ) {
      let errorMessage = 'Installed service id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.installedServiceService
      .editInstalledService(body, request.user.userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing the installed service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/installed-service/get-installed-services-by-user-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user installed services by user id.',
    description:
      'Gets user installed services by user id. This api requires a user id.',
  })
  async getInstalledServicesByUserId(@Param('userId') userId: string) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Home id is required and must be entered and must be entered correctly.',
      );
    }

    await this.installedServiceService
      .getInstalledServicesByUserId(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get(
    'v1/installed-service/get-installed-services-by-device-encrypted-id/:deviceEncryptedId',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user installed services by device encrypted id.',
    description:
      'Gets user installed services by user id. This api requires a user id.',
  })
  async getInstalledServicesByDeviceEncryptedId(
    @Param('deviceEncryptedId') deviceEncryptedId: string,
  ) {
    await this.installedServiceService
      .getInstalledServicesByDeviceEncryptedId(deviceEncryptedId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services profiles!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('v1/installed-service/get-all-installed-services')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all installed services.',
    description: 'Gets all installed services.',
  })
  async getAllInstalledServices() {
    await this.installedServiceService
      .getAllInstalledServices()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while fetching installed services!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Delete(
    'v1/installed-service/delete-installed-service-by-installed-service-id/:installedServiceId',
  )
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a installed service with id.' })
  async deleteInstalledServiceByInstalledServiceId(
    @Param('installedServiceId') installedServiceId: string,
    @Request() request,
  ) {
    if (
      installedServiceId === null ||
      installedServiceId === undefined ||
      installedServiceId === '' ||
      Types.ObjectId.isValid(String(installedServiceId)) === false
    ) {
      let errorMessage = 'Installed service id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }


    try {
      this.vmContexts[installedServiceId.toString()].terminateVm()
      console.log("Virtual Machine Terminated Successfully !");
    } catch (e) {
      console.log("Error While Terminating Virtual Machine: ", e);
    }

    await this.installedServiceService
      .deleteInstalledServiceByInstalledServiceId(
        installedServiceId,
        request.user.userId,
      )
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.log("Errrrrrrorrrrrrrrrrrrrrr Isssssssssssssss:", error);
        
        let errorMessage =
          'Some errors occurred while deleting the installed service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}

