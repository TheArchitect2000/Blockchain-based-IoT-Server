import { Document } from 'mongoose';

export interface DeviceLog extends Document {
  event: string;
  data: string;
  deviceId: string;
  deviceEncryptedId: string;
  senderDeviceEncryptedId: string;
  insertDate: string;
}
