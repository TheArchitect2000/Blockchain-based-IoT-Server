import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ServiceModel } from '../models/service.model';

@Injectable()
export class ServiceRepository {
  private result;

  constructor(
    @InjectModel('service')
    private readonly serviceModel?: ServiceModel,
  ) {}

  async insertService(data) {
    await this.serviceModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while service insertion!';
        console.error('Error is: ', error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.serviceModel.create(data)
  }

  async editService(id, editedData) {
    await this.serviceModel
      .updateOne({ _id: { $eq: id } }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while service update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getServiceById(
    _id,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.serviceModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getServiceByNodeIdAnd_id(
    nodeID,
    nodeServiceId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.serviceModel
      .findOne({ nodeId: nodeID, _id: nodeServiceId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getServicesByUserId(
    userId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.serviceModel
      .find({ userId: userId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getAllServices(whereCondition, populateCondition, selectCondition) {
    return await this.serviceModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async deleteServiceByNodeIdAndNodeServiceID(nodeId, serviceNodeId) {
    await this.serviceModel
      .deleteMany()
      .where({ nodeServiceId: serviceNodeId, nodeId: nodeId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting service in service repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async deleteAllUserServicesPermanently(userId) {
    const serviceUserId = new Types.ObjectId(userId);

    await this.serviceModel
      .deleteMany()
      .where({ userId: serviceUserId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user services in service repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }
}
