import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { InstalledServiceRepository } from '../repositories/installed-service.repository';

export type InstalledService = any;

@Injectable()
export class InstalledServiceService {
  private result;

  constructor(
    private readonly installedServiceRepository?: InstalledServiceRepository,
  ) {}

  async insertInstalledService(body) {
    console.log('Body: ', body);

    let newInstalledService = {
      userId: body.userId,
      serviceId: body.serviceId,
      installedServiceName: body.installedServiceName,
      installedServiceImage: body.installedServiceImage,
      description: body.description,
      code: body.code,
      deviceMap: body.deviceMap,
      insertedBy: body.userId,
      insertDate: new Date(),
      updatedBy: body.userId,
      updateDate: new Date(),
    };

    let insertedService =
      await this.installedServiceRepository.insertInstalledService(
        newInstalledService,
      );
    console.log('User installed service inserted!');
    return insertedService;
  }

  async editInstalledService(body, userId): Promise<any> {
    let whereCondition = { _id: body.installedServiceId };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';
    let foundInstalledService: any = null;

    console.log('we are in editInstalledService service!');
    console.log('body: ', body);
    console.log('userId: ', userId);

    await this.installedServiceRepository
      .getInstalledServiceById(
        body.installedServiceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundInstalledService = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a installed service for edit!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundInstalledService && foundInstalledService !== undefined && foundInstalledService.deletable){
    if (foundInstalledService && foundInstalledService !== undefined) {
      if (
        body.installedServiceId != null ||
        body.installedServiceId != undefined
      ) {
        foundInstalledService.installedServiceId = body.installedServiceId;
      }
      if (body.serviceId != null || body.serviceId != undefined) {
        foundInstalledService.serviceId = body.serviceId;
      }
      if (
        body.installedServiceImage != null ||
        body.installedServiceImage != undefined
      ) {
        foundInstalledService.installedServiceImage = body.installedServiceImage;
      }

      if (
        body.installedServiceName != null ||
        body.installedServiceName != undefined
      ) {
        foundInstalledService.installedServiceName = body.installedServiceName;
      }
      
      if (body.description != null || body.description != undefined) {
        foundInstalledService.description = body.description;
      }
      if (body.deviceMap != null || body.deviceMap != undefined) {
        foundInstalledService.deviceMap = body.deviceMap;
      }
      foundInstalledService.updatedBy = userId;
      foundInstalledService.updatedAt = new Date();
    }

    console.log(
      'Updated found installed service for edit is: ',
      foundInstalledService,
    );

    await this.installedServiceRepository
      .editInstalledService(foundInstalledService._id, foundInstalledService)
      .then((data) => {
        this.result = data;
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

  async getInstalledServiceById(installedServiceId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    // if (ObjectID.isValid(serviceId)){
    if (mongoose.isValidObjectId(installedServiceId)) {
      await this.installedServiceRepository
        .getInstalledServiceById(
          installedServiceId,
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

  async getInstalledServicesByUserId(userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';
    let foundServices: any = null;

    console.log('we are in getInstalledServicesByUserId service!');

    foundServices =
      await this.installedServiceRepository.getInstalledServicesByUserId(
        userId,
        whereCondition,
        populateCondition,
        selectCondition,
      );

    console.log('Found installed services are: ', foundServices);

    return foundServices;
  }

  async getInstalledServicesByDeviceEncryptedId(deviceEncryptedId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description code deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';
    let foundService: any = null;

    await this.installedServiceRepository
      .getInstalledServicesByDeviceEncryptedId(
        deviceEncryptedId,
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

    return foundService;
  }

  async getAllInstalledServices() {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description code deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';
    let foundServices: any = null;
    let response = [];

    console.log('we are in getAllInstalledServices service!');

    console.log('we are 1.5');

    try {
      foundServices = await this.installedServiceRepository.getAllInstalledServices(
        whereCondition,
        populateCondition,
        selectCondition,
      );
    } catch (error) {
      console.log(error);
    }

    console.log('we are 2!');

    foundServices.forEach((element) => {
      response.push({
        _id: element._id,
        serviceId: element.serviceId,
        installedServiceName: element.installedServiceName,
        code: element.code,
        description: element.description,
        deviceMap: element.deviceMap,
        installedServiceImage: element.installedServiceImage,
        activationStatus: element.activationStatus,
        insertedBy: element.insertedBy,
        insertDate: element.insertDate,
      });
    });

    console.log(response);

    console.log("3");  

    return response;
  }

  async deleteInstalledServiceByInstalledServiceId(
    installedServiceId,
    userId,
  ): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id isDeleted userId serviceId installedServiceName description insertedBy insertDate isDeletable isDeleted deletedBy deleteDate deletionReason updatedBy updateDate';
    let foundInstalledService: any = null;

    await this.installedServiceRepository
      .getInstalledServiceById(
        installedServiceId,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        foundInstalledService = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a installed service for deletion!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundInstalledService && foundInstalledService !== undefined && foundInstalledService.deletable){
    if (foundInstalledService && foundInstalledService !== undefined) {
      foundInstalledService.isDeleted = true;
      foundInstalledService.deletedBy = userId;
      foundInstalledService.deleteDate = new Date();
      foundInstalledService.updatedBy = userId;
      foundInstalledService.updateDate = new Date();
    }

    console.log(
      'Updated found installed service for deletion is: ',
      foundInstalledService,
    );

    await this.installedServiceRepository
      .editInstalledService(foundInstalledService._id, foundInstalledService)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing and deleting a installed service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllUserInstalledServicesPermanently(userId) {
    await this.installedServiceRepository
      .deleteAllUserInstalledServicesPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user installed services in installed service service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
