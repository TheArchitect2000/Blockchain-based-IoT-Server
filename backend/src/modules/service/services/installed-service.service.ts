import { Inject, Injectable, forwardRef } from '@nestjs/common';
import mongoose from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { InstalledServiceRepository } from '../repositories/installed-service.repository';
import { VirtualMachineHandlerService } from 'src/modules/virtual-machine/services/service-handler.service';
import { NotificationService } from 'src/modules/notification/notification/notification.service';

export type InstalledService = any;

@Injectable()
export class InstalledServiceService {
  private result;

  constructor(
    private readonly installedServiceRepository?: InstalledServiceRepository,
    @Inject(forwardRef(() => VirtualMachineHandlerService))
    private readonly virtualMachineHandlerService?: VirtualMachineHandlerService,
    private readonly notificationService?: NotificationService,
  ) {}

  async insertInstalledService(body) {
    //console.log('Body: ', body);

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

  async editInstalledService(body, userId, isAdmin = false): Promise<any> {
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundInstalledService && foundInstalledService !== undefined && foundInstalledService.deletable){
    if (foundInstalledService && foundInstalledService !== undefined) {
      if (
        foundInstalledService.userId.toString() !== userId.toString() &&
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
        foundInstalledService.installedServiceImage =
          body.installedServiceImage;
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
        throw new GeneralException(
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
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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

  async getInstalledServicesByDeviceEncryptedId(
    deviceEncryptedId,
    userId = '',
    isAdmin = false,
  ) {
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (
      userId &&
      foundService.every(
        (service) => service.userId.toString() === userId.toString(),
      ) &&
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

    try {
      foundServices =
        await this.installedServiceRepository.getAllInstalledServices(
          whereCondition,
          populateCondition,
          selectCondition,
        );
    } catch (error) {
      console.log(error);
    }

    foundServices.forEach((element) => {
      response.push({
        _id: element._id,
        serviceId: element.serviceId,
        userId: element.userId,
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

    return response;
  }

  async deleteServicesOfAnUserWithDeviceId(userId: string, deviceEncryptedId: string) {
    return await this.installedServiceRepository.deleteInstalledServicesFromUserWithDeviceEncryptedId(userId, deviceEncryptedId)
  }

  async deleteInstalledServiceByInstalledServiceId(
    installedServiceId,
    userId = '',
    isAdmin = false,
    messageToOwner: string = '',
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    // if(foundInstalledService && foundInstalledService !== undefined && foundInstalledService.deletable){
    if (foundInstalledService && foundInstalledService !== undefined) {
      if (
        userId &&
        foundInstalledService.userId.toString() !== userId.toString() &&
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
    }

    await this.virtualMachineHandlerService.deleteVirtualMachinByServiceId(
      installedServiceId,
    );

    if (messageToOwner && messageToOwner.length > 0) {
      this.notificationService.addNotificationForUserById(
        {
          message: messageToOwner,
          title: 'Installed service warning',
          userId: foundInstalledService.userId.toString(),
        },
        userId,
      );
    }
    await this.installedServiceRepository.deleteInstalledServiceById(
      foundInstalledService._id,
    );

    return true
  }

  async deleteAllUserInstalledServicesPermanently(userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition =
      '_id userId serviceId installedServiceName description deviceMap installedServiceImage activationStatus insertedBy insertDate updatedBy updateDate';

    const installedServices =
      await this.installedServiceRepository.getInstalledServicesByUserId(
        userId,
        whereCondition,
        populateCondition,
        selectCondition,
      );

    installedServices.map((insService) => {
      this.virtualMachineHandlerService.deleteVirtualMachinByServiceId(
        insService._id,
      );
    });

    /* Installed Services Are: [
           {
             _id: new ObjectId("6698cae3fd3eb511ff55ea52"),
             userId: new ObjectId("6698c929fd3eb511ff55e882"),
             serviceId: new ObjectId("6671295f9b95696aeb855918"),
             installedServiceName: 'Service Image',
             description: 'this is for testing upload image api',
             deviceMap: { MULTI_SENSOR_1: 'MTI6YXM6M2E6Zzc6YmM=' },
             installedServiceImage: 'https://developer.fidesinnova.io/app/uploads/file-1718697876645-253018426.png',
             activationStatus: 'active',
             insertedBy: new ObjectId("6698c929fd3eb511ff55e882"),
             insertDate: 2024-07-18T07:57:23.505Z,
             updatedBy: new ObjectId("6698c929fd3eb511ff55e882"),
             updateDate: 2024-07-18T07:57:23.505Z
           }
         ] */

    await this.installedServiceRepository
      .deleteAllUserInstalledServicesPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user installed services in installed service service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
