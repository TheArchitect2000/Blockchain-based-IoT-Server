import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ChangeEmailTokenModel, UserModel } from '../models/user.model';
import { UserChangeEmailTokenInterface } from '../interfaces/user.interface';
import { changeEmailTokenSchema, userSchema } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  private result;

  constructor(
    @InjectModel('user')
    private readonly userModel?: UserModel,
    @InjectModel('email-token')
    private readonly changeEmailTokenModel?: ChangeEmailTokenModel,
  ) {
    setTimeout(() => {
      this.runAllDataBaseEmailChanges();
    }, 3000);
  }

  getUserKeys(): string {
    return Object.keys(userSchema.paths).join(' ');
  }

  getChangeEmailKeys(): string {
    return Object.keys(changeEmailTokenSchema.paths).join(' ');
  }

  async runAllDataBaseEmailChanges() {
    await this.replaceAllEmailsWithUserNames();
    await this.deleteAllUserNames();
  }

  async getChangeEmailWithToken(token: string) {
    return await this.changeEmailTokenModel
      .findOne({ token: token })
      .where({ expireDate: { $gt: new Date() } })
      .populate([])
      .select(this.getChangeEmailKeys());
  }
  
  async getChangeEmailWithUserId(userId: string) {
    return await this.changeEmailTokenModel
      .findOne({ userId: userId })
      .where({ expireDate: { $gt: new Date() } })
      .populate([])
      .select(this.getChangeEmailKeys());
  }

  async deleteChangeEmailToken(token: string) {
    return await this.changeEmailTokenModel
      .deleteOne({ token: token })
      .where({})
      .populate([]);
  }

  async replaceAllEmailsWithUserNames() {
    await this.userModel.updateMany(
      {
        userName: { $exists: true, $ne: null },
        email: { $exists: true, $ne: null },
      },
      [{ $set: { email: { $ifNull: ['$userName', '$email'] } } }],
    );

    return true;
  }

  async deleteAllUserNames() {
    try {
      await this.userModel.updateMany(
        { userName: { $exists: true, $ne: null } }, // No filter, applies to all documents
        { $unset: { userName: '' } }, // Remove the userName field
      );
      return true;
    } catch (error) {
      const errorMessage = 'Some errors occurred while deleting userName!';
      console.log(error.message); // Log the actual error
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
  }

  async insertUser(data) {
    await this.userModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user insertion!';
        console.log(error.message);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async insertChangeEmailToken(data) {
    await this.changeEmailTokenModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while insert change email token!';
        console.log(error.message);
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async changeUserEmail(userId, newEmail) {
    await this.userModel
      .updateOne({ _id: userId }, { $set: {email: newEmail} })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user change email!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async editUser(id, editedData) {
    const { email, ...restData } = editedData;
    await this.userModel
      .updateOne({ _id: id }, { $set: restData })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user update!';
        throw new GeneralException(
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.userModel.paginate(finalQuery, options, (error, data) => {
      if (error) {
        throw new GeneralException(
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
