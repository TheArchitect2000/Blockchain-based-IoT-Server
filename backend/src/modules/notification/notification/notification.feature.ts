import { NotificationSchema } from './notification.schema';

export const notificationFeature = [
  { name: 'notification', schema: NotificationSchema }, // The name of user must be the same in @InjectModel in repository and service
];
