import { Model } from 'mongoose';
import { DeviceLog } from '../interfaces/device-log.interface';

export interface DeviceLogModel extends Model<DeviceLog> {
  [x: string]: any;
}
