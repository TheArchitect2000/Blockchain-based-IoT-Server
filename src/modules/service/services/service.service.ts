import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ServiceRepository } from '../repositories/service.repository';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';

export type Service = any;

@Injectable()
export class ServiceService {
  private result;

  constructor(private readonly serviceRepository?: ServiceRepository) {}

  async insertService(body) {
    console.log('Body: ', body);

    let newService = {
      userId: body.userId,
      serviceName: body.serviceName,
      description: body.description,
      serviceType: body.serviceType,
      status: body.status,
      blocklyJson: body.blocklyJson,
      code: body.code,
      devices: body.devices,
      insertedBy: body.userId,
      insertDate: new Date(),
      updatedBy: body.userId,
      updateDate: new Date(),
    };

    let insertedService = await this.serviceRepository.insertService(
      newService,
    );
    console.log('User service inserted!');
    return insertedService;
  }

  async editService(body, userId): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId deviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    console.log('we are in editService service!');
    console.log('body: ', body);
    console.log('userId: ', userId);

    await this.serviceRepository
      .getServiceById(
        body.serviceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundService = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a service for edit!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      if (body.serviceName != null || body.serviceName != undefined) {
        foundService.serviceName = body.serviceName;
      }
      if (body.description != null || body.description != undefined) {
        foundService.description = body.description;
      }
      console.log("foundService image issssss:" + foundService.serviceImage);
      console.log("bodyService image issssss:" + body.serviceImage);
      
      if (body.serviceImage != null || body.serviceImage != undefined) {
        foundService.serviceImage = body.serviceImage;
      }
      if (body.serviceType != null || body.serviceType != undefined) {
        foundService.serviceType = body.serviceType;
      }
      if (body.status != null || body.status != undefined) {
        foundService.status = body.status;
      }
      if (body.devices != null || body.devices != undefined) {
        foundService.devices = body.devices;
      }
      if (body.blocklyJson != null || body.blocklyJson != undefined) {
        foundService.blocklyJson = body.blocklyJson;
      }
      if (body.code != null || body.code != undefined) {
        foundService.code = body.code;
      }
      foundService.updatedBy = userId;
      foundService.updatedAt = new Date();
    }

    console.log('Updated found service for edit is: ', foundService);

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
        console.log("editing service: ");
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while renaming a device!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getServiceById(serviceId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    // if (ObjectID.isValid(serviceId)){
    if (mongoose.isValidObjectId(serviceId)) {
      await this.serviceRepository
        .getServiceById(
          serviceId,
          whereCondition,
          populateCondition,
          selectCondition,
        )
        .then((data) => {
          foundService = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a service!';
          throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return foundService;
  }

  async getServicesByUserId(userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      'serviceName description serviceType status blocklyJson code devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyXML code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundServices: any = null;

    console.log('we are in getServicesByUserId service!');

    foundServices = await this.serviceRepository.getServicesByUserId(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found services are: ', foundServices);

    return foundServices;
  }

  async getAllServices() {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      'serviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundServices: any = null;
    let response = [];

    console.log('we are in getAllServices service!');

    foundServices = await this.serviceRepository.getAllServices(
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found services are: ', foundServices);

    foundServices.forEach((element) => {
      response.push({
        _id: element._id,
        serviceName: element.serviceName,
        description: element.description,
        serviceType: element.serviceType,
        status: element.status,
        serviceCreator: element.serviceCreator,
        devices: element.devices,
        numberOfInstallations: element.numberOfInstallations,
        installationPrice: element.installationPrice,
        runningPrice: element.runningPrice,
        rate: element.rate,
        serviceImage: element.serviceImage,
        blocklyJson: element.blocklyJson,
        code: element.code,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });
    console.log('response are: ', response);

    return response;
  }

  async deleteServiceByServiceId(serviceId, userId): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id isDeleted userId serviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundService: any = null;

    await this.serviceRepository
      .getServiceById(
        serviceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundService = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a service for deletion!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      foundService.isDeleted = true;
      foundService.deletedBy = userId;
      foundService.deleteDate = new Date();
      foundService.updatedBy = userId;
      foundService.updateDate = new Date();
    }

    console.log('Updated found service for deletion is: ', foundService);

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing and deleting a service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllUserServicesPermanently(userId) {
    await this.serviceRepository
      .deleteAllUserServicesPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user services in service service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
