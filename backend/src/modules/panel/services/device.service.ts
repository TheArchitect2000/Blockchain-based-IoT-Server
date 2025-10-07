import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Mongoose, Connection } from 'mongoose';
import mongoose from 'mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { DeviceRepository } from '../repositories/device.repository';
import * as randompassword from 'secure-random-password';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

// Nodejs encryption with CTR
let crypto = require('crypto');
let algorithm = 'aes-256-ctr';
let defaultEncryptionPassword = 'SDfsae4d6F3Efeq';
const initializationVector = '5183666c72eec9e4';

/**
 * Device manipulation service.
 */

@Injectable()
export class DeviceService {
  private result;

  constructor(
    /*  @InjectConnection('panelDb') 
        private connection: Connection, */
    private readonly deviceRepository?: DeviceRepository,
  ) {}

  /* async generatePassword(len) {
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
    let newDevice = {
      HomeId: body.homeId,
      Name: body.name,
      Password: await this.generatePassword(20),
      DeviceType: body.deviceType,
      MAC: body.mac,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let insertedDevice = await this.deviceRepository.insertDevice(newDevice);
    console.log('Customer device inserted!');
    return insertedDevice;
  }

  async getDevicesByHomeId(homeId) {
    let whereCondition = { Removed: false };
    let populateCondition = [];
    let selectCondition =
      'Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
    let foundDevices: any = null;

    console.log('we are in getDeviceByHomeId service!');

    foundDevices = await this.deviceRepository.findDevicesByHomeId(
      homeId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found devices are: ', foundDevices);

    return foundDevices;
  }

  async getDevicesWithEncryptedDeviceIdByHomeId(homeId) {
    let whereCondition = { Removed: false };
    let populateCondition = [];
    let selectCondition =
      'Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
    let foundDevices: any = null;
    let foundDevicesWithEncryptedDeviceId = [];
    let encryptedDeviceId;

    console.log('we are in getDeviceByHomeId service!');

    foundDevices = await this.deviceRepository.findDevicesByHomeId(
      homeId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found devices are: ', foundDevices);

    foundDevices.forEach((element) => {
      encryptedDeviceId = this.encryptDeviceId(element._id.toString());
      console.log('encryptedDeviceId is: ', encryptedDeviceId);
      foundDevicesWithEncryptedDeviceId.push({
        _id: element._id,
        EncryptedId: encryptedDeviceId,
        Removed: element.Removed,
        HomeId: element.HomeId,
        Name: element.Name,
        GPS: element.GPS,
        Password: element.Password,
        IsActive: element.IsActive,
        DeviceType: element.DeviceType,
        MAC: element.MAC,
        InstallationDate: element.createdAt,
        UpdateDate: element.updatedAt,
      });
    });
    console.log(
      'foundDevicesWithEncryptedDeviceId are: ',
      foundDevicesWithEncryptedDeviceId,
    );

    return foundDevicesWithEncryptedDeviceId;
  }

  async findDeviceById(deviceId) {
    let whereCondition = { Removed: false };
    let populateCondition = [];
    let selectCondition =
      '_id Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
    let foundDevice: any = null;

    // if (ObjectID.isValid(deviceId)){
    if (mongoose.isValidObjectId(deviceId)) {
      await this.deviceRepository
        .findDeviceById(
          deviceId,
          whereCondition,
          populateCondition,
          selectCondition,
        )
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

  async checkDeviceIsExist(deviceMac) {
    let whereCondition = { Removed: false };
    let populateCondition = [];
    let selectCondition =
      'Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
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

  async editDevice(id, data) {
    let editedDevice: any = null;
    await await this.deviceRepository
      .editDevice(id, data)
      .then((data) => {
        editedDevice = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a device!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return editedDevice;
  }

  async renameDevice(body): Promise<any> {
    let whereCondition = { _id: body.deviceId };
    let populateCondition = [];
    let selectCondition =
      '_id Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
    let foundDevice: any = null;

    console.log('we are in renameDevice service!');

    await this.deviceRepository
      .findDeviceById(
        body.deviceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundDevice = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a device for deletion!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundDevice && foundDevice !== undefined && foundDevice.deletable){
    if (foundDevice && foundDevice !== undefined) {
      foundDevice.Name = body.newName;
      foundDevice.updatedAt = new Date();
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

  async deleteDeviceByDeviceId(deviceId): Promise<any> {
    let whereCondition = { Removed: false };
    let populateCondition = [];
    let selectCondition =
      '_id Removed HomeId Name GPS Password IsActive DeviceType createdAt updatedAt RemoveTime MAC';
    let foundDevice: any = null;

    await this.deviceRepository
      .findDeviceById(
        deviceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundDevice = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a device for deletion!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundDevice && foundDevice !== undefined && foundDevice.deletable){
    if (foundDevice && foundDevice !== undefined) {
      foundDevice.Removed = true;
      foundDevice.RemoveTime = new Date();
      foundDevice.updatedAt = new Date();
    }

    console.log('Updated found device for deletion is: ', foundDevice);

    await this.deviceRepository
      .editDevice(foundDevice._id, foundDevice)
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

  async deleteCustomerAllDevicesPermanently(customerHomeId) {
    await this.deviceRepository
      .deleteAllCustomerDevicesPermanently(customerHomeId)
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
  } */
}
