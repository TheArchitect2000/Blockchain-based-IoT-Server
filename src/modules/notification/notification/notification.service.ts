import { log } from 'console';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user/user.service';
import { SendNotificationRequestBodyDto } from '../dto/send-notif-dto';
import firebase from 'firebase-admin';

import * as serviceAccount from '../../../fidesinnova-aa633-firebase-adminsdk-utzec-ac7cc3e00e.json';
import { NotificationRepository } from './notification.repository';
import {
  AddNotificationByEmailRequestBodyDto,
  AddNotificationRequestBodyDto,
  AddPublicNotificationRequestBodyDto,
  EditNotificationRequestBodyDto,
} from '../dto/notification.dto';
import { NotificationSchema } from './notification.schema';

@Injectable()
export class NotificationService {
  firebaseApp: firebase.app.App;

  constructor(
    @Inject(UserService)
    private userService?: UserService,
    private notificationRepository?: NotificationRepository,
  ) {
    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount as any),
    });
  }

  getNotificationKeys(): string[] {
    return Object.keys(NotificationSchema.paths);
  }

  sendToken(token: string, userId: string) {
    return this.userService.setFirebaseToken(userId, token);
  }

  async sendNotification(notification: SendNotificationRequestBodyDto) {
    const user = await this.userService.getUserFirebaseTokenById(
      notification.user,
    );
    if (!user) throw new BadRequestException(undefined, 'user not found');
    const firebaseToken = user.firebaseToken;
    if (!firebaseToken)
      throw new BadRequestException(undefined, 'user has no firebase token');

    try {
      await firebase.messaging(this.firebaseApp).send({
        token: firebaseToken,
        notification: {
          title: notification.title,
          body: notification.message,
        },
      });
      return 'notification send';
    } catch (err) {
      console.log(err);

      throw new BadRequestException(undefined, err.message);
    }
  }

  async addNotificationForUserById(
    data: AddNotificationRequestBodyDto,
    insertedBy: string,
  ) {
    const insertData = {
      ...data,
      insertDate: new Date(),
      insertedBy: insertedBy,
    };

    return this.notificationRepository.insertNotif(insertData);
  }

  async addNotificationForUserByEmail(
    data: AddNotificationByEmailRequestBodyDto,
  ) {
    const theUser = await this.userService.findAUserByEmail(
      data.userEmail,
      { isDeleted: false },
      [],
      '_id firstName lastName email',
    );
    
    const insertData = {
      ...data,
      insertDate: new Date(),
      userId: theUser._id,
      insertedBy: theUser._id,
    };

    return this.notificationRepository.insertNotif(insertData);
  }

  async getUserNotificationsByUserId(userId: string) {
    return this.notificationRepository.getNotReadNotificationsForUserById(
      userId,
    );
  }

  async getAllUserNotificationsByUserId(userId: string) {
    return this.notificationRepository.getAllNotificationsForUserById(userId);
  }

  async getPublicNotifications() {
    return this.notificationRepository.getPublicNotifications();
  }

  async getNotificationById(notifId: string) {
    return this.notificationRepository.getNotificationById(notifId);
  }

  async readNotificationsByNotificationIds(notifList: string[]) {
    notifList.forEach(async (item) => {
      await this.notificationRepository.editNotificationByNotifId(item, {
        read: true,
      });
    });

    return { status: true, message: 'Notifications readed successfully' };
  }

  async editNotificationById(
    notifId: string,
    editedValues: EditNotificationRequestBodyDto,
  ) {
    const expireDate = new Date();
    expireDate.setDate(
      expireDate.getDate() + Number(editedValues.expiryDate.toString()),
    );
    expireDate.setHours(23, 59, 59, 999);

    const notifData = await this.notificationRepository.getNotificationById(
      notifId,
    );

    if (notifData.public == true) {
      return await this.notificationRepository.editNotificationByNotifId(
        notifId,
        { ...editedValues, expiryDate: expireDate },
      );
    } else {
      const { expiryDate, ...rest } = editedValues;
      return await this.notificationRepository.editNotificationByNotifId(
        notifId,
        rest,
      );
    }
  }

  async addPublicNotification(
    data: AddPublicNotificationRequestBodyDto,
    insertedBy: string,
  ) {
    const expireDate = new Date();
    expireDate.setDate(
      expireDate.getDate() + Number(data.expiryDate.toString()),
    );
    expireDate.setHours(23, 59, 59, 999);
    const insertData = {
      ...data,
      userId: 'root',
      public: true,
      expiryDate: expireDate,
      insertDate: new Date(),
      insertedBy: insertedBy,
    };

    return this.notificationRepository.insertNotif(insertData);
  }
}
