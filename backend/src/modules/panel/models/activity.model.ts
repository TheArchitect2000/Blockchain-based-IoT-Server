import { Model } from 'mongoose';
import { Activity } from '../interfaces/activity.interface';

export interface ActivityModel extends Model<Activity> {
  [x: string]: any;
}
