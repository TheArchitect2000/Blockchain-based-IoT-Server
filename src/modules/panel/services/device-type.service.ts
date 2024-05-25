import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DeviceTypeRepository } from '../repositories/device-type.repository';
import * as randompassword from 'secure-random-password';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
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
export class DeviceTypeService {
  private result;

  constructor(
    /*  @InjectConnection('panelDb') 
        private connection: Connection, */
    private readonly deviceTypeRepository?: DeviceTypeRepository,
  ) {}

  async getAllDeviceTypes() {
    let whereCondition = {};
    let populateCondition = [];
    let selectCondition =
      'OTA Controllers Published Active DeviceType DeviceName Type Data Commands CommandType VersionNo createdAt updatedAt';
    let foundDeviceTypes: any = null;
    let response = [];

    console.log('we are in getDeviceByHomeId service!');

    foundDeviceTypes = await this.deviceTypeRepository.findAllDeviceTypes(
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found device types are: ', foundDeviceTypes);

    foundDeviceTypes.forEach((element) => {
      response.push({
        _id: element._id,
        OTA: element.OTA,
        Controllers: element.Controllers,
        Published: element.Published,
        Active: element.Active,
        DeviceType: element.DeviceType,
        Type: element.Type,
        Data: element.Data,
        Commands: element.Commands,
        CommandType: element.CommandType,
        VersionNo: element.VersionNo,
      });
    });
    console.log('response are: ', response);

    return response;
  }
}
