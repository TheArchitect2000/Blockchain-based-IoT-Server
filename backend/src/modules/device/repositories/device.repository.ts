import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { DeviceModel } from '../models/device.model';
import { deviceSchema } from '../schemas/device.schema';
import { userSchema } from 'src/modules/user/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class DeviceRepository {
  private result;

  constructor(
    @InjectModel('device')
    private readonly deviceModel?: DeviceModel,
  ) {}

  getDeviceKeys(): string {
    return Object.keys(deviceSchema.paths).join(' ');
  }

  getUserKeys(): string {
    return Object.keys(userSchema.paths).join(' ');
  }

  async insertDevice(data) {
    await this.deviceModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while device insertion!';
        console.log(error);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.deviceModel.create(data)
  }

  async editDevice(id, editedData) {
    try {
      const result = (await this.deviceModel.updateOne(
        { _id: id },
        { $set: editedData },
      )) as any;

      if (result.nModified === 0) {
        throw new GeneralException(
          ErrorTypeEnum.NOT_FOUND,
          'Device not found or no changes were made.',
        );
      }

      return result;
    } catch (error) {
      // Provide a more specific error message
      let errorMessage = 'Some errors occurred while updating the device!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
  }

  async updateAllNodeIds(nodeId: string) {
    return await this.deviceModel.updateMany(
      {
        $or: [
          { nodeDeviceId: { $exists: false } }, // checks if the nodeDeviceId field is missing
          { nodeDeviceId: '' }, // checks if the nodeDeviceId field is empty
        ],
      },
      {
        $set: { nodeId: nodeId }, // updates the nodeId field with the provided nodeId value
      },
    );
  }

  async getDeviceById(_id) {
    return await this.deviceModel
      .findOne({ _id })
      .where({ isDeleted: false })
      .populate([])
      .select(this.getDeviceKeys());
  }

  async getDevicesByUserId(
    userId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in getDevicesByUserId repository!');

    return await this.deviceModel
      .find({ userId: userId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findDeviceByMac(
    deviceMac,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findDeviceByMac repository!');

    return await this.deviceModel
      .findOne({ mac: deviceMac })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findDeviceByNodeIdAnd_id(
    nodeId,
    nodeDeviceId,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    console.log('we are in findDeviceByNodeIdAndNodeDeviceId repository!');

    return await this.deviceModel
      .findOne({ nodeId: nodeId, _id: nodeDeviceId })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async getInstalledDevicesByDate(query) {
    return await this.deviceModel.find(query);
  }

  async getAllActiveDevices(query) {
    return await this.deviceModel.find(query);
  }

  async deleteDeviceByNodeIdAndDeviceId(nodeId, deviceId) {
    await this.deviceModel
      .deleteMany()
      .where({ nodeId: nodeId, nodeDeviceId: deviceId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting device in device repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async deleteDeviceByDeviceId(deviceId) {
    await this.deviceModel
      .deleteOne()
      .where({ _id: deviceId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting device in device repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async deleteAllUserDevicesPermanently(userId) {
    const deviceUserId = new Types.ObjectId(userId);

    await this.deviceModel
      .deleteMany()
      .where({ userId: deviceUserId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting devices in device repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.deviceModel.paginate(
      finalQuery,
      options,
      (error, data) => {
        if (error) {
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'An error occurred while paginate users.',
          );
        } else {
          return data;
        }
      },
    );
  }

  async getDeviceByEncryptedId(encryptId) {
    console.log('we are in getAllDevices repository!');

    return await this.deviceModel
      .findOne({ deviceEncryptedId: encryptId })
      .where({ isDeleted: false })
      .populate([])
      .select(this.getDeviceKeys());
  }

  async getAllDevices(whereCondition, populateCondition, selectCondition) {
    console.log('we are in getAllDevices repository!');

    return await this.deviceModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async localShareDeviceWithId(deviceId: string, userId: string) {
    return await this.deviceModel
      .updateOne(
        { _id: deviceId },
        {
          $addToSet: {
            sharedWith: userId,
          },
        },
      )
      .select(this.getDeviceKeys());
  }

  async localUnshareDeviceWithId(deviceId: string, userId: string) {
    return await this.deviceModel
      .updateOne(
        { _id: deviceId },
        {
          $pull: {
            sharedWith: userId,
          },
        },
      )
      .select(this.getDeviceKeys());
  }

  async getLocalSharedUsersWithDeviceId(deviceId: string) {
    return await this.deviceModel
      .findById(deviceId)
      .populate({
        path: 'sharedWith',
        model: 'user',
        select: 'firstName lastName email avatar',
      })
      .select('sharedWith');
  }

  async getDevicesLocalSharedWithUserId(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    return await this.deviceModel
      .find({
        sharedWith: { $elemMatch: { $eq: userObjectId } },
      })
      .select(this.getDeviceKeys());
  }

  async isDeviceSharedWithUser(deviceId: string, userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const result = await this.deviceModel.findOne({
      _id: deviceId,
      sharedWith: { $elemMatch: { $eq: userObjectId } }, // Checks if userId exists in sharedWith
    });

    return !!result; // Returns true if found, false otherwise
  }
}
