import { Inject, Injectable, forwardRef } from '@nestjs/common';
import mongoose from 'mongoose';
import { DeviceRepository } from '../repositories/device.repository';
import * as randompassword from 'secure-random-password';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { UserService } from 'src/modules/user/services/user/user.service';
import { DeviceLogService } from './device-log.service';
import { EditDeviceDto } from '../data-transfer-objects/edit-device.dto';
import { NotificationService } from 'src/modules/notification/notification/notification.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { ContractService } from 'src/modules/smartcontract/services/contract.service';
import { AppService } from 'src/app.service';
import { BuildingService } from 'src/modules/building/buildings/building.service';

// Nodejs encryption with CTR
let crypto = require('crypto');
let algorithm = 'aes-256-ctr';
let defaultEncryptionPassword = 'SDfsae4d6F3Efeq';
const initializationVector = '5183666c72eec9e4';

function decodeDeviceEncryptedIds(array) {
  array.forEach((item) => {
    if (item.deviceEncryptedId) {
      // Decode deviceEncryptedId and set it as mac
      item.mac = Buffer.from(item.deviceEncryptedId, 'base64').toString('utf8');
    }
  });
}

/**
 * Device manipulation service.
 */

@Injectable()
export class DeviceService {
  private result;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService?: UserService,
    private readonly deviceLogService?: DeviceLogService,
    private readonly deviceRepository?: DeviceRepository,
    private readonly notificationService?: NotificationService,
    private readonly buildingService?: BuildingService,
    @Inject(forwardRef(() => AppService))
    private readonly appService?: AppService,
    @Inject(forwardRef(() => InstalledServiceService))
    private readonly installedService?: InstalledServiceService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService?: ContractService,
  ) {}

  async generatePassword(len) {
    return randompassword.randomPassword({
      length: len,
      characters:
        randompassword.lower +
        randompassword.upper +
        randompassword.digits +
        '^&*()',
    });
  }

  encryptDeviceId(deviceId) {
    console.log('deviceId: ', deviceId);
    let cipher = crypto.createCipher(algorithm, defaultEncryptionPassword);
    console.log('cipher: ', cipher);
    let encrypted = cipher.update(deviceId, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    encrypted = encrypted.replace(/\//g, '~').replace(/\+/g, '_');
    return encrypted;
  }

  decryptDeviceId(encryptedDeviceId) {
    encryptedDeviceId = encryptedDeviceId.replace(/_/g, '+').replace(/~/g, '/');
    let decipher = crypto.createDecipheriv(
      algorithm,
      defaultEncryptionPassword,
      initializationVector,
    );
    let decrypted = decipher.update(encryptedDeviceId, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    // console.log('decryptid', text, dec);
    return decrypted;
  }

  async insertDevice(body) {
    let deviceEncryptedId = null;

    if (body.mac) {
      deviceEncryptedId = Buffer.from(body.mac, 'utf8').toString('base64');
    } else {
      deviceEncryptedId = body?.deviceEncryptedId || null;
    }

    let newDevice = {
      nodeId: String(body?.nodeId),
      nodeDeviceId: String(body?.nodeDeviceId),
      userId: body.userId,
      deviceName: body.deviceName,
      isShared: body?.isShared || false,
      password: await this.generatePassword(20),
      deviceType: body.deviceType,
      mac: body?.mac || null,
      deviceEncryptedId: deviceEncryptedId,
      parameters: body.parameters,
      location: body.location,
      geometry: body?.geometry || null,
      insertedBy: body?.userId,
      insertDate: new Date(),
      updatedBy: body.userId,
      updateDate: new Date(),
    };

    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      'isDeleted userId deviceName deviceType mac deviceEncryptedId hardwareVersion firmwareVersion parameters isShared costOfUse location geometry insertedBy insertDate updatedBy updateDate';

    let exist = null;

    if (
      newDevice?.nodeDeviceId != 'undefined' ||
      newDevice?.nodeDeviceId == null ||
      newDevice?.nodeDeviceId == undefined
    ) {
      exist = await this.deviceRepository.findDeviceByNodeIdAnd_id(
        newDevice?.nodeId,
        newDevice?.nodeDeviceId,
        whereCondition,
        populateCondition,
        selectCondition,
      );
    } else {
      exist = null;
    }

    if (exist == null || exist == undefined) {
      let insertedDevice = await this.deviceRepository.insertDevice(newDevice);
      console.log('Device inserted!', exist);
      return insertedDevice;
    } else {
      console.log('Device exist!', exist);
      return exist;
    }
  }

  async getDevicesByUserId(userId) {
    let foundDevices: any = null;

    console.log('we are in getDeviceByUserId service!');

    foundDevices = await this.deviceRepository.getDevicesByUserId(userId);

    decodeDeviceEncryptedIds(foundDevices);

    //console.log('Found devices are: ', foundDevices);

    const updatedDevices = foundDevices.map((item: any) => {
      const imageUrl = this.appService.getDeviceUrlByType(
        item.deviceType.toString(),
      );
      return {
        ...item._doc,
        image: imageUrl.toString() as string,
      };
    });

    return updatedDevices;
  }

  async getDevicesWithEncryptedDeviceIdByUserId(userId) {
    let foundDevices: any = null;
    let foundDevicesWithEncryptedDeviceId = [];
    let encryptedDeviceId;

    console.log('we are in getDeviceByUserId service!');

    foundDevices = await this.deviceRepository.getDevicesByUserId(userId);

    //console.log('Found devices are: ', foundDevices);

    foundDevices.forEach((element) => {
      encryptedDeviceId = this.encryptDeviceId(element._id.toString());
      //console.log('encryptedDeviceId is: ', encryptedDeviceId);
      foundDevicesWithEncryptedDeviceId.push({
        _id: element._id,
        encryptedId: encryptedDeviceId,
        isDeleted: element.isDeleted,
        userId: element.userId,
        deviceName: element.deviceName,
        deviceType: element.deviceType,
        mac: element.mac,
        installationDate: element.insertDate,
        updateDate: element.updateDate,
      });
    });
    console.log(
      'foundDevicesWithEncryptedDeviceId are: ',
      foundDevicesWithEncryptedDeviceId,
    );

    return foundDevicesWithEncryptedDeviceId;
  }

  async getDeviceById(deviceId) {
    let foundDevice: any = null;

    // if (ObjectID.isValid(deviceId)){
    if (mongoose.isValidObjectId(deviceId)) {
      await this.deviceRepository
        .getDeviceById(deviceId)
        .then((data) => {
          foundDevice = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a device!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return foundDevice;
  }

  async findADeviceByMac(
    mac,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.deviceRepository.findDeviceByMac(
      mac,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async getInstalledDevicesByDate(
    installationYear,
    installationMonth,
    installationDay,
  ) {
    let startDate = new Date(
      installationYear,
      installationMonth - 1,
      installationDay,
    );
    let endDate = new Date(
      installationYear,
      installationMonth - 1,
      installationDay,
    );
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    let foundDevices: any = null;
    let formatedFoundDevices;

    let query = {
      isDeleted: false,
      insertDate: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    console.log(query);

    await this.deviceRepository
      .getInstalledDevicesByDate(query)
      .then(async (data) => {
        foundDevices = data;

        formatedFoundDevices = [];

        for (const element of foundDevices) {
          let foundUser;
          await this.userService
            .findAUserById(element.userId)
            .then((data) => {
              foundUser = data;

              formatedFoundDevices.push({
                _id: element._id,
                deviceEncryptedId: element.deviceEncryptedId,
                mac: element.mac,
                deviceName: element.deviceName,
                deviceType: element.deviceType,
                userId: element.userId,
                walletAddress: foundUser.walletAddress
                  ? foundUser.walletAddress
                  : null,
                insertDate: element.insertDate,
              });
            })
            .catch((error) => {
              let errorMessage =
                'Some errors occurred while finding user for installed devices!';
              throw new GeneralException(ErrorTypeEnum.NOT_FOUND, error);
            });
        }
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding installed devices!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    console.log('formatedFoundDevices are: ', formatedFoundDevices);
    return formatedFoundDevices;
  }

  async getNumberOfPayloadsSentByDevicesByDate(
    reportYear,
    reportMonth,
    reportDay,
  ) {
    let startDate = new Date(reportYear, reportMonth - 1, reportDay);
    let endDate = new Date(reportYear, reportMonth - 1, reportDay);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

    let foundDevices: any = null;
    let formatedFoundDevices;

    let query = {
      isDeleted: false,
    };

    console.log(query);

    await this.deviceRepository
      .getAllActiveDevices(query)
      .then(async (data) => {
        foundDevices = data;

        formatedFoundDevices = [];

        for (const element of foundDevices) {
          let foundUser;
          await this.userService
            .findAUserById(element.userId)
            .then((data) => {
              foundUser = data;

              formatedFoundDevices.push({
                _id: element._id,
                deviceEncryptedId: element.deviceEncryptedId,
                mac: element.mac,
                deviceName: element.deviceName,
                deviceType: element.deviceType,
                userId: element.userId,
                walletAddress: foundUser.walletAddress
                  ? foundUser.walletAddress
                  : null,
                payloadsSent: 0,
                insertDate: element.insertDate,
              });
            })
            .catch((error) => {
              let errorMessage =
                'Some errors occurred while finding user for installed active devices!';
              throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
            });
        }
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding installed active devices!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    console.log('formatedFoundDevices are: ', formatedFoundDevices);

    for (const element of formatedFoundDevices) {
      let foundDeviceLog;
      await this.deviceLogService
        .getDeviceLogByEncryptedDeviceIdAndDate(
          element.deviceEncryptedId,
          reportYear,
          reportMonth,
          reportDay,
        )
        .then((data) => {
          foundDeviceLog = data;

          console.log('foundDeviceLog: ', foundDeviceLog);

          element.payloadsSent = foundDeviceLog.length;
          console.log('foundDeviceLog.length: ', foundDeviceLog.length);
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding logs for installed active devices!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return formatedFoundDevices;
  }

  async checkDeviceIsExist(deviceMac) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      'isDeleted userId deviceName deviceEncryptedId deviceType mac insertedBy insertDate updatedBy updateDate';
    let foundDevice = null;

    console.log('I am in checkDeviceIsExist!');

    foundDevice = await this.findADeviceByMac(
      deviceMac,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (foundDevice) {
      console.log('Device found!');
      return true;
    } else {
      console.log('Device not found!');
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'Device does not exist.',
      );
      // return false
    }
  }

  async editDevice(body: EditDeviceDto, userId: any, isAdmin = false) {
    let foundDevice: any = null;

    console.log('we are in editDevice service!');

    await this.deviceRepository
      .getDeviceById(body.deviceId)
      .then((data) => {
        foundDevice = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a device for rename!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundDevice && foundDevice !== undefined) {
      console.log('Founded Device is:', foundDevice);

      console.log(
        `Device Node: ${foundDevice.nodeId} ||| BackEnd Node: ${process.env.NODE_ID}`,
      );

      if (String(foundDevice.nodeId) !== String(process.env.NODE_ID)) {
        let errorMessage = `You can't edit other nodes devices !`;
        throw new GeneralException(ErrorTypeEnum.FORBIDDEN, errorMessage);
      }

      if (
        foundDevice &&
        foundDevice != undefined &&
        foundDevice.userId != userId &&
        isAdmin == false
      ) {
        let errorMessage = 'Access Denied.';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }
      foundDevice.nodeId = String(process.env.NODE_ID);
      foundDevice.updatedBy =
        String(userId) == 'root' ? foundDevice.updatedBy : userId;
      foundDevice.updateDate = new Date();
    }

    const newData = { ...foundDevice._doc, ...body };

    console.log('Updated found device for edit is: ', foundDevice);
    await this.deviceRepository
      .editDevice(foundDevice._id, newData)
      .then((data) => {
        this.result = data;
        if (body.isShared == true && foundDevice.isShared == false) {
          this.contractService.shareDevice(
            String(process.env.NODE_ID),
            String(newData._id),
            String(newData.userId),
            String(newData.deviceName),
            String(newData.deviceType),
            String(newData.deviceEncryptedId),
            String(newData.hardwareVersion),
            String(newData.firmwareVersion),
            newData.parameters.map((param) => JSON.stringify(param)),
            String(newData.costOfUse),
            newData.location.coordinates.map((coordinate) =>
              String(coordinate),
            ),
            String(newData.insertDate),
          );
        }
        if (body.isShared == false && foundDevice.isShared == true) {
          this.buildingService.deleteDeviceIdFromAllBuildings(newData.deviceEncryptedId);
          this.contractService.removeSharedDevice(
            process.env.NODE_ID,
            String(newData._id),
          );
        }
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a device!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async updateAllDevices() {
    await this.deviceRepository.updateAllNodeIds(process.env.NODE_ID);
  }

  async renameDevice(body, userId, isAdmin = false): Promise<any> {
    let foundDevice: any = null;

    console.log('we are in renameDevice service!');

    await this.deviceRepository
      .getDeviceById(body.deviceId)
      .then((data) => {
        foundDevice = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a device for rename!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundDevice && foundDevice !== undefined && foundDevice.deletable){
    if (foundDevice && foundDevice !== undefined) {
      if (
        foundDevice &&
        foundDevice != undefined &&
        foundDevice.userId != userId &&
        isAdmin == false
      ) {
        let errorMessage = 'Access Denied.';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }

      foundDevice.deviceName = body.deviceName;
      foundDevice.updatedBy = userId;
      foundDevice.updateDate = new Date();
    }

    console.log('Updated found device for rename is: ', foundDevice);

    await this.deviceRepository
      .editDevice(foundDevice._id, foundDevice)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while renaming a device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getAllSharedDevices() {
    let whereCondition = { isDeleted: false, isShared: true };
    let populateCondition = [];
    let selectCondition =
      'deviceName deviceType mac nodeId nodeDeviceId deviceEncryptedId hardwareVersion firmwareVersion parameters location geometry insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundDevices: any = null;
    let response = [];

    console.log('we are in getAllSharedDevices service!');

    foundDevices = await this.deviceRepository.getAllDevices(
      whereCondition,
      populateCondition,
      selectCondition,
    );

    decodeDeviceEncryptedIds(foundDevices);

    /* const logPromises = foundDevices.map(async (device) => {
      try {
        console.log('Device encrypt isssss:', device.deviceEncryptedId);

        const res =
          await this.deviceLogService.getDeviceLogByEncryptedDeviceIdAndFieldName(
            device.deviceEncryptedId,
            '',
            true,
            true,
          );

        device.lastLog = res;

        //console.log('Result is:', res);
      } catch (error) {
        console.error(
          `Error fetching log for device ${device.deviceEncryptedId}:`,
          error,
        );
      }
    }); */

    //await Promise.all(logPromises);

    foundDevices.forEach((element) => {
      response.push({
        _id: element._id,
        deviceName: element.deviceName,
        nodeId: element.nodeId,
        nodeDeviceId: element.nodeDeviceId,
        deviceType: element.deviceType,
        mac: element.mac,
        deviceEncryptedId: element.deviceEncryptedId,
        hardwareVersion: element.hardwareVersion,
        firmwareVersion: element.firmwareVersion,
        parameters: element.parameters,
        location: element.location,
        geometry: element.geometry,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });
    //console.log('response are: ', response);

    return response;
  }

  async getAllDevices() {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id insertedBy deviceName nodeId nodeDeviceId deviceType mac deviceEncryptedId hardwareVersion firmwareVersion parameters isShared location geometry insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundDevices: any = null;
    let response = [];

    console.log('we are in getAllDevices service!');

    foundDevices = await this.deviceRepository.getAllDevices(
      whereCondition,
      populateCondition,
      selectCondition,
    );

    //console.log('Found devices are: ', foundDevices);

    foundDevices.forEach((element) => {
      response.push({
        _id: element._id,
        userId: element.insertedBy,
        nodeId: element.nodeId,
        nodeDeviceId: element.nodeDeviceId,
        deviceName: element.deviceName,
        deviceType: element.deviceType,
        mac: element.mac,
        deviceEncryptedId: element.deviceEncryptedId,
        hardwareVersion: element.hardwareVersion,
        firmwareVersion: element.firmwareVersion,
        parameters: element.parameters,
        isShared: element.isShared,
        location: element.location,
        geometry: element.geometry,
      });
    });
    //console.log('response are: ', response);

    return response;
  }

  async getDeviceInfoByEncryptedId(encryptId, userId = '', isAdmin = false) {
    let foundDevices: any = null;
    let response = {};

    console.log('we are in getDeviceInfoByEncryptedId service!');

    foundDevices = await this.deviceRepository.getDeviceByEncryptedId(
      encryptId,
    );

    //console.log('foundeddddddd deviceeeeeeeeee: ', foundDevices);

    if (
      userId.length > 0 &&
      foundDevices &&
      foundDevices != undefined &&
      foundDevices.userId != userId &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied.';
      this.result = {
        message: errorMessage,
        success: false,
        date: new Date(),
      };
      return this.result;
    }

    /* response = {
      _id: foundDevices._id,
      deviceName: foundDevices.deviceName,
      deviceType: foundDevices.deviceType,
      mac: foundDevices.mac,
      deviceEncryptedId: foundDevices.deviceEncryptedId,
      hardwareVersion: foundDevices.hardwareVersion,
      firmwareVersion: foundDevices.firmwareVersion,
      parameters: foundDevices.parameters,
      isShared: foundDevices.isShared,
      location: foundDevices.location,
      geometry: foundDevices.geometry,
    }; */

    //console.log('response are: ', response);

    return foundDevices;
  }

  async deleteOtherNodeDeviceByNodeIdAndDeviceId(
    nodeId,
    deviceId,
    deviceEncryptedId,
  ): Promise<any> {
    const installedServices =
      await this.installedService.getInstalledServicesByDeviceEncryptedId(
        deviceEncryptedId,
      );

    installedServices.map((insService) => {
      this.installedService.deleteInstalledServiceByInstalledServiceId(
        insService._id,
        '',
        true,
        `Installed service with name "${insService.installedServiceName}" has been delete because device isn't available anymore`,
      );
    });

    await this.deviceRepository
      .deleteDeviceByNodeIdAndDeviceId(nodeId, deviceId)
      .then((data) => {
        this.result = data;
        this.buildingService.deleteDeviceIdFromAllBuildings(deviceEncryptedId);
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing and deleting a device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteDeviceByDeviceId(
    deviceId,
    userId = '',
    isAdmin = false,
  ): Promise<any> {
    let foundDevice: any = null;

    await this.deviceRepository
      .getDeviceById(deviceId)
      .then((data) => {
        foundDevice = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a device for deletion!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (
      userId.length > 0 &&
      foundDevice &&
      foundDevice != undefined &&
      foundDevice.userId != userId &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied.';
      this.result = {
        message: errorMessage,
        success: false,
        date: new Date(),
      };
      return this.result;
    }

    console.log('Updated found device for deletion is: ', foundDevice);

    this.contractService.removeSharedDevice(
      process.env.NODE_ID,
      String(foundDevice._id),
    );

    this.buildingService.deleteDeviceIdFromAllBuildings(
      String(foundDevice.deviceEncryptedId),
    );

    const installedServices =
      await this.installedService.getInstalledServicesByDeviceEncryptedId(
        foundDevice.deviceEncryptedId,
      );

    installedServices.map((insService) => {
      this.installedService.deleteInstalledServiceByInstalledServiceId(
        insService._id,
        userId,
        false,
        `Installed service with name "${insService.installedServiceName}" has been delete because device isn't available anymore`,
      );
    });

    await this.deviceRepository
      .deleteDeviceByDeviceId(foundDevice._id)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing and deleting a device!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllUserDevicesPermanently(userId: string) {
    const devices = await this.deviceRepository.getDevicesByUserId(userId);

    for (const element of devices) {
      this.contractService.removeSharedDevice(
        process.env.NODE_ID,
        String(element._id),
      );

      this.buildingService.deleteDeviceIdFromAllBuildings(
        String(element.deviceEncryptedId),
      );

      const installedServices =
        await this.installedService.getInstalledServicesByDeviceEncryptedId(
          element.deviceEncryptedId,
        );

      await Promise.all(
        installedServices.map(async (insService) => {
          await this.installedService.deleteInstalledServiceByInstalledServiceId(
            insService._id,
            userId,
            false,
            `Installed service with name "${insService.installedServiceName}" has been deleted because the device is no longer available`,
          );
        }),
      );
    }

    await this.deviceRepository
      .deleteAllUserDevicesPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting customer devices in device service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async localShareDeviceWithUserId(
    deviceId: string,
    userId: string,
    ownerId: string,
    isAdmin = false,
  ) {
    const foundDevices = await this.deviceRepository.getDeviceById(deviceId);

    if (foundDevices == null) {
      let errorMessage = 'Device not found.';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    if (String(foundDevices.userId) === String(userId)) {
      let errorMessage = `Local device sharing with yourself is not allowed.`;
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    if (
      ownerId.length > 0 &&
      foundDevices &&
      foundDevices != undefined &&
      String(foundDevices.userId) !== String(ownerId) &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied.';
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, errorMessage);
    }

    const checkExist = await this.deviceRepository.isDeviceSharedWithUser(
      deviceId,
      userId,
    );

    if (checkExist == true) {
      let errorMessage = 'This device is already shared with the user.';
      throw new GeneralException(ErrorTypeEnum.CONFLICT, errorMessage);
    }

    const result = await this.deviceRepository.localShareDeviceWithId(
      deviceId,
      userId,
    );

    return result;
  }

  async localUnshareDeviceWithUserId(
    deviceId: string,
    userId: string,
    ownerId: string,
    isAdmin = false,
  ) {
    const foundDevices = await this.deviceRepository.getDeviceById(deviceId);

    if (foundDevices == null) {
      let errorMessage = 'Device not found.';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    if (String(foundDevices.userId) === String(userId)) {
      let errorMessage = `Local device sharing with yourself is not allowed.`;
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    if (
      ownerId.length > 0 &&
      foundDevices &&
      foundDevices != undefined &&
      String(foundDevices.userId) !== String(ownerId) &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied.';
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, errorMessage);
    }

    const checkExist = await this.deviceRepository.isDeviceSharedWithUser(
      deviceId,
      userId,
    );

    if (checkExist == false) {
      let errorMessage = 'The device is not shared with this user.';
      throw new GeneralException(ErrorTypeEnum.CONFLICT, errorMessage);
    }

    const result = await this.deviceRepository.localUnshareDeviceWithId(
      deviceId,
      userId,
    );

    this.installedService.deleteServicesOfAnUserWithDeviceId(userId, String(foundDevices.deviceEncryptedId))

    this.buildingService.deleteDeviceIdFromBuildingsByUserId(String(foundDevices.deviceEncryptedId), userId);

    return result;
  }

  async getSharedUsersWithDeviceId(
    deviceId: string,
    userId: string,
    isAdmin = false,
  ) {
    const foundDevices = await this.deviceRepository.getDeviceById(deviceId);

    if (foundDevices == null) {
      let errorMessage = 'Device not found.';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    if (
      userId.length > 0 &&
      foundDevices &&
      foundDevices != undefined &&
      String(foundDevices.userId) !== String(userId) &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied.';
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, errorMessage);
    }

    const result = await this.deviceRepository.getLocalSharedUsersWithDeviceId(
      deviceId,
    );

    return result.sharedWith;
  }

  async getSharedDevicesWithUserId(userId: string) {
    const result = await this.deviceRepository.getDevicesLocalSharedWithUserId(
      userId,
    );

    const updatedDevices = result.map((item: any) => {
      const imageUrl = this.appService.getDeviceUrlByType(
        item.deviceType.toString(),
      );
      return {
        ...item._doc,
        image: imageUrl.toString() as string,
      };
    });

    return updatedDevices;
  }

  async isDeviceSharedWithUser(deviceId: string, userId: string) {
    const checkExist = await this.deviceRepository.isDeviceSharedWithUser(
      deviceId,
      userId,
    );
    return checkExist;
  }

  async isDeviceEncryptedSharedWithUser(
    deviceEncryptedId: string,
    userId: string,
  ) {
    const deviceData = await this.getDeviceInfoByEncryptedId(deviceEncryptedId);

    const checkExist = await this.deviceRepository.isDeviceSharedWithUser(
      deviceData._id,
      userId,
    );
    return checkExist;
  }
}
