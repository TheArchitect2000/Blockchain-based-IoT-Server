import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { NotificationModel } from './notification.model';
import { NotificationSchema } from './notification.schema';

@Injectable()
export class NotificationRepository {
  private result;

  constructor(
    @InjectModel('notification')
    private readonly notificationModel?: NotificationModel,
  ) {}

  getNotificationKeys(): string {
    return Object.keys(NotificationSchema.paths).join(' ');
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
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getReadNotificationsForUserById(userId) {
    return await this.notificationModel
      .find({ userId: userId, read: true })
      .where({})
      .populate([])
      .select(this.getNotificationKeys());
  }

  async getNotReadNotificationsForUserById(userId) {
    return await this.notificationModel
      .find({ userId: userId, read: false })
      .where({})
      .populate([])
      .select(this.getNotificationKeys());
  }

  async getNotificationById(notifId) {
    return await this.notificationModel
      .findOne({ _id: notifId })
      .where({})
      .populate([])
      .select(this.getNotificationKeys());
  }

  async getAllNotificationsForUserById(userId) {
    return await this.notificationModel
      .find({ userId: userId })
      .where({})
      .populate([])
      .select(this.getNotificationKeys());
  }

  async getPublicNotifications() {
    const nowDate = new Date();
    return await this.notificationModel
      .find({ public: true })
      .where({ expiryDate: { $gte: nowDate } }) // $gte for "greater than or equal to"
      .populate([])
      .select(this.getNotificationKeys());
  }

  async editNotificationByNotifId(notifId, editedFields) {
    try {
      const result = await this.notificationModel
        .updateOne(
          { _id: { $eq: notifId } },
          { $set: editedFields }, // Use $set to update specific fields
        )
        .exec();

      return result;
    } catch (error) {
      const errorMessage =
        'Some errors occurred while setting notification as read!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
  }
}
