import { log } from 'console';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user/user.service';
import { SendNotificationRequestBodyDto } from '../dto/send-notif-dto';
import firebase from 'firebase-admin';

import * as serviceAccount from '../../../fidesinnova-aa633-firebase-adminsdk-utzec-ac7cc3e00e.json';

@Injectable()
export class NotificationService {
  firebaseApp: firebase.app.App;
  constructor(private userService: UserService) {
    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount as any),
    });
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
}
