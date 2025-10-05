import { Injectable } from '@nestjs/common';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { InstalledServiceModel } from '../models/installed-service.model';
import { installedServiceSchema } from '../schemas/installed-service.schema';
import { DeleteResult, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InstalledServiceRepository {
  private result;

  constructor(
    @InjectModel('installed-service')
    private readonly installedServiceModel?: InstalledServiceModel,
  ) {}

  getInstalledServicesKeys(): string {
    return Object.keys(installedServiceSchema.paths).join(' ');
  }

  async insertInstalledService(data) {
    await this.installedServiceModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while installed service insertion!';
        console.error('Error is: ', error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.installedServiceModel.create(data)
  }

  async deleteInstalledServiceById(id): Promise<DeleteResult> {
    return await this.installedServiceModel.deleteOne({ _id: id });
  }

  async deleteInstalledServicesFromUserWithDeviceEncryptedId(
    userId: string,
    deviceEncryptedId: string,
  ): Promise<DeleteResult> {
    const theUserId = new Types.ObjectId(userId);
    return await this.installedServiceModel.deleteMany({
      userId: theUserId,
      deviceMap: { $in: [deviceEncryptedId] },
    });
  }

  async editInstalledService(id, editedData) {
    await this.installedServiceModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while installed service update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getInstalledServiceById(
    _id,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.installedServiceModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getInstalledServicesByUserId(
    userId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in getInstalledServicesByUserId repository!');

    return await this.installedServiceModel
      .find({ userId: userId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getInstalledServicesByDeviceEncryptedId(
    deviceEncryptedId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log(
      'we are in getInstalledServicesByDeviceEncryptedId repository!',
    );
    console.log('deviceEncryptedId is: ', deviceEncryptedId);

    return await this.installedServiceModel
      .find({ deviceMap: { $in: [deviceEncryptedId] } })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getAllInstalledServices(
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in getAllInstalledServices repository!');

    let res = await this.installedServiceModel
      .find()
      .where({ isDeleted: false })
      .populate([])
      .select(this.getInstalledServicesKeys());

    console.log('rese is: ', res);

    return res;
  }

  async deleteAllUserInstalledServicesPermanently(userId) {
    const installedServiceUserId = new Types.ObjectId(userId);

    await this.installedServiceModel
      .deleteMany()
      .where({ userId: installedServiceUserId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user installed services in service repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }
}
