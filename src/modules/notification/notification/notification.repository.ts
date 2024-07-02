import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { NotificationModel } from './notification.model';
import { NotificationSchema } from './notification.schema';

@Injectable()
export class NotificationRepository {
  private result;

  constructor(
    @InjectModel('notification')
    private readonly notificationModel?: NotificationModel,
  ) {}

  getNotificationKeys(): string[] {
    return Object.keys(NotificationSchema.paths);
  }

  async insertNotif(data) {
    await this.notificationModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while inserting notification!';
        console.log(error.message);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getSeenNotificationsForUserById(userId) {
    return await this.notificationModel
      .findOne({ userId: userId, seen: true })
      .where({})
      .populate([])
      .select(this.getNotificationKeys().join(' '));
  }

  async getNotSeenNotificationsForUserById(userId) {
    return await this.notificationModel
      .findOne({ userId: userId, seen: false })
      .where({})
      .populate([])
      .select(this.getNotificationKeys().join(' '));
  }

  async getAllNotificationsForUserById(userId) {
    return await this.notificationModel
      .findOne({ userId: userId })
      .where({})
      .populate([])
      .select(this.getNotificationKeys().join(' '));
  }

  async seenNotificationByUserIdAndNotifId(userId, notifId) {
    await this.notificationModel
      .updateOne({ userId: userId, _id: notifId }, {})
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

  /* async insertUser(data) {
    await this.notificationModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while user insertion!';
        console.log(error.message);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;

    // return await this.notificationModel.create(data)
  }

  async editUser(id, editedData) {
    await this.notificationModel
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
    return await this.notificationModel
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
    await this.notificationModel
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
    await this.notificationModel
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
    return await this.notificationModel
      .findOne({ userName: userName })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async deleteUserPermanently(userId) {
    const userProfileId = new Types.ObjectId(userId);

    await this.notificationModel
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
    await this.notificationModel
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
    return await this.notificationModel.paginate(
      finalQuery,
      options,
      (error, data) => {
        if (error) {
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'An error occurred while paginate users.',
          );
        } else {
          return data;
        }
      },
    );
  }

  async getAllUsers(whereCondition, populateCondition, selectCondition) {
    console.log('we are in getAllUsers repository!');

    return await this.notificationModel
      .find()
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  } */
}
