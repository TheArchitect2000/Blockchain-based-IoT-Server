import { Model } from 'mongoose';
import { Device } from '../interfaces/device.interface';

export interface DeviceModel extends Model<Device> {
  [x: string]: any;
}
