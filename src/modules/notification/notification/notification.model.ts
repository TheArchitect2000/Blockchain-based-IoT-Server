import { Model } from 'mongoose';
import { Notification } from './notification.interface';

export interface NotificationModel extends Model<Notification> {
  [x: string]: any;
}
