import { Model } from 'mongoose';
import { DeviceType } from '../interfaces/device-type.interface';

export interface DeviceTypeModel extends Model<DeviceType> {
  [x: string]: any;
}
