import { Model } from 'mongoose';
import { Subscriptions } from '../interface/subscriptions.interface';

export interface SubscriptionModel extends Model<Subscriptions> {
  [x: string]: any;
}
