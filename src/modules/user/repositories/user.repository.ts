import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserRepository {
  private result;

  constructor(
    @InjectModel('user')
    private readonly userModel?: UserModel,
  ) {}

  async insertUser(data) {
    await this.userModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user insertion!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.userModel.create(data)
  }

  async editUser(id, editedData) {
    await this.userModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user update!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findUserById(_id, whereCondition, populateCondition, selectCondition) {
    return await this.userModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findUserByEmail(
    email,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    await this.userModel
      .findOne({ email: email })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while find user by email in user repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findUserByMobile(
    mobile,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    await this.userModel
      .findOne({ mobile: mobile })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while find user by mobile in user repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findAUserByUserName(
    userName,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.userModel
      .findOne({ userName: userName })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async deleteUserPermanently(userId) {
    const userProfileId = new Types.ObjectId(userId);

    await this.userModel
      .deleteMany()
      .where({ _id: userProfileId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while deleting user in user repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async searchUsers(finalQuery, options) {
    await this.userModel
      .find(finalQuery)
      .populate({ path: 'roles' })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while finding a user!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.userModel.paginate(finalQuery, options, (error, data) => {
      if (error) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'An error occurred while paginate users.',
        );
      } else {
        return data;
      }
    });
  }

  async getAllUsers(whereCondition, populateCondition, selectCondition) {
    console.log('we are in getAllUsers repository!');

    return await this.userModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }
}
