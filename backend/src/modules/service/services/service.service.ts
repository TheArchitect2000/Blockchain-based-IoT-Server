import { forwardRef, Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ServiceRepository } from '../repositories/service.repository';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ContractService } from 'src/modules/smartcontract/services/contract.service';

export type Service = any;

@Injectable()
export class ServiceService {
  private result;

  constructor(
    private readonly serviceRepository?: ServiceRepository,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService?: ContractService,
  ) {}

  async insertService(body) {
    console.log('Body: ', body);

    let newService = {
      nodeId: body?.nodeId || null,
      nodeServiceId: body?.nodeServiceId || null,
      userId: body.userId,
      serviceName: body.serviceName,
      description: body.description,
      serviceImage: body.serviceImage,
      installationPrice: body?.installationPrice || null,
      published: body?.published || false,
      runningPrice: body?.runningPrice || null,
      serviceType: body.serviceType,
      status: body.status,
      blocklyJson: body.blocklyJson,
      code: body.code,
      devices: body.devices,
      insertedBy: body?.userId || '',
      insertDate: body?.insertDate ? body?.insertDate : new Date(),
      updatedBy: body?.userId || '',
      updateDate: body?.updateDate ? body?.updateDate : new Date(),
    };

    const exist = await this.getServiceByNodeIdAndNodeServiceId(
      body?.nodeId || null,
      body?.nodeServiceId || null,
    );

    if (exist == null || exist == undefined || exist == '') {
      console.log('service exist!');
      return exist;
    } else {
      let insertedService = await this.serviceRepository.insertService(
        newService,
      );
      console.log('service inserted!');
      return insertedService;
    }
  }

  async editService(body, userId, isAdmin = false): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId deviceName nodeId nodeServiceId published nodeId nodeServiceId publishRequested publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      if (
        foundService.userId.toString() !== userId.toString() &&
        isAdmin == false
      ) {
        let errorMessage = 'Access Denied!';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }

      if (
        foundService.published === true ||
        foundService.publishRequested === true ||
        foundService.publishRejected === true
      ) {
        let errorMessage = 'Some errors occurred while editing a service!';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }

      if (body.serviceName != null || body.serviceName != undefined) {
        foundService.serviceName = body.serviceName;
      }
      if (body.description != null || body.description != undefined) {
        foundService.description = body.description;
      }
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
        console.log('editing service: ');
        console.log(data);
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while renaming a service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async publishService(body, userId, nodePublish = false): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceName published nodeId nodeServiceId publishRequested publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    console.log('we are in publishService service!');
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
          'Some errors occurred while finding a service for publish!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      foundService.published = true;
      foundService.publishRejected = false;
      foundService.publishRequested = false;

      foundService.updatedBy = userId;
      foundService.updatedAt = new Date();
    }

    console.log('Updated found service for publish is: ', foundService);

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
        if (nodePublish == false) {
          this.contractService.createService(
            String(process.env.NODE_ID),
            String(foundService._id),
            String(foundService.serviceName),
            String(foundService.description),
            String(foundService.serviceType),
            JSON.stringify(foundService.devices),
            String(foundService.installationPrice),
            String(foundService.runningPrice),
            String(foundService.serviceImage),
            String(foundService.code),
            String(foundService.insertDate),
            String(new Date()),
          );
        }
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while publishing a service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async cancelServiceRequest(body, userId, nodePublish = false): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId deviceName published nodeId nodeServiceId publishRequested publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    console.log('we are in publishService service!');
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
          'Some errors occurred while finding a service for canceling!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      foundService.published = false;
      foundService.publishRejected = false;
      foundService.publishRequested = false;

      foundService.updatedBy = userId;
      foundService.updatedAt = new Date();
    }

    console.log('Updated found service for cancel request is: ', foundService);

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
        if (nodePublish == false) {
          this.contractService.removeService(
            process.env.NODE_ID,
            String(foundService._id),
          );
        }
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while canceling a service request !';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async rejectService(body, userId): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId deviceName published nodeId nodeServiceId publishRequested publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    console.log('we are in rejectService service!');
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
        this.contractService.removeService(
          process.env.NODE_ID,
          String(foundService._id),
        );
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a service for reject!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      foundService.publishRejected = true;
      foundService.published = false;
      foundService.publishRequested = false;

      foundService.updatedBy = userId;
      foundService.updatedAt = new Date();
    }

    console.log('Updated found service for reject is: ', foundService);

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while publishing a service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async requestServicePublish(body, userId): Promise<any> {
    let whereCondition = { _id: body.serviceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId deviceName published nodeId nodeServiceId publishRequested publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    console.log('we are in requestPublishService service!');
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
          'Some errors occurred while finding a service for publishing request!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      if (
        foundService.published === true ||
        foundService.publishRequested === true ||
        foundService.publishRejected === true
      ) {
        let errorMessage =
          'Some errors occurred while requesting publish a service!';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }

      foundService.publishRequested = true;

      foundService.updatedBy = userId;
      foundService.updatedAt = new Date();
    }

    console.log(
      'Updated found service for publishing request is: ',
      foundService,
    );

    await this.serviceRepository
      .editService(foundService._id, foundService)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while requesting publish a service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getServiceById(serviceId, userId, isAdmin = false) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceName description nodeId nodeServiceId published publishRequested publishRejected serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
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
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    if (
      foundService &&
      foundService != undefined &&
      foundService.userId != userId &&
      isAdmin == false
    ) {
      let errorMessage = 'Access Denied!';
      this.result = {
        message: errorMessage,
        success: false,
        date: new Date(),
      };
      return this.result;
    }

    return foundService;
  }

  async getServiceByNodeIdAndNodeServiceId(nodeId, nodeServiceId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceName nodeId nodeServiceId description published publishRequested publishRejected serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    await this.serviceRepository
      .getServiceByNodeIdAndNodeServiceId(
        nodeId,
        nodeServiceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundService = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a service!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return foundService;
  }

  async getServicesByUserId(userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      'serviceName description serviceType nodeId nodeServiceId published publishRequested publishRejected status blocklyJson code devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyXML code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
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
      'serviceName published publishRequested nodeId nodeServiceId publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
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
        published: element.published,
        publishRequested: element.publishRequested,
        publishRejected: element.publishRejected,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });

    return response;
  }

  async getAllPublishedServices() {
    let whereCondition = { isDeleted: false, published: true };
    let populateCondition = [];
    let selectCondition =
      'serviceName published publishRequested nodeId nodeServiceId publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
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
        published: element.published,
        publishRequested: element.publishRequested,
        publishRejected: element.publishRejected,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });

    return response;
  }

  async getAllPublishRequestedServices() {
    let whereCondition = { isDeleted: false, publishRequested: true };
    let populateCondition = [];
    let selectCondition =
      'serviceName published publishRequested nodeId nodeServiceId publishRejected description serviceType status devices numberOfInstallations installationPrice runningPrice rate serviceImage blocklyJson code insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
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
        published: element.published,
        publishRequested: element.publishRequested,
        publishRejected: element.publishRejected,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });

    return response;
  }

  async deleteServiceByServiceId(
    serviceId,
    userId,
    isAdmin = false,
  ): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id isDeleted userId published publishRequested publishRejected serviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundService && foundService !== undefined && foundService.deletable){
    if (foundService && foundService !== undefined) {
      if (
        foundService.userId.toString() !== userId.toString() &&
        isAdmin == false
      ) {
        let errorMessage = 'Access Denied!';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }
      if (
        foundService.published === true ||
        foundService.publishRequested === true ||
        foundService.publishRejected === true
      ) {
        let errorMessage = 'Some errors occurred while deleting a service!';
        this.result = {
          message: errorMessage,
          success: false,
          date: new Date(),
        };
        return this.result;
      }

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
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteServiceByNodeServiceIdAndNodeId(
    nodeId,
    nodeServiceId,
  ): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id isDeleted userId published nodeId nodeServiceId publishRequested publishRejected serviceName description serviceType status devices numberOfInstallations installationPrice runningPrice rate insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundService: any = null;

    await this.serviceRepository
      .getServiceByNodeIdAndNodeServiceId(
        nodeId,
        nodeServiceId,
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    await this.serviceRepository
      .deleteServiceByNodeIdAndNodeServiceID(nodeId, nodeServiceId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while deleting a service!';
        throw new GeneralException(
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
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
