import { Model } from 'mongoose';
import { Service } from '../interfaces/service.interface';

export interface ServiceModel extends Model<Service> {
  [x: string]: any;
}
