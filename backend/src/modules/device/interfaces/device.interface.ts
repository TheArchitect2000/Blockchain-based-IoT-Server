import { Types } from 'mongoose';
import { Document } from 'mongoose';

export interface Device extends Document {
  nodeMqttAddress?: string;
  userId: string;
  nodeId: string;
  nodeDeviceId: string;
  deviceName: string;
  deviceType: string;
  password: string;
  mac: string;
  deviceEncryptedId: string;
  hardwareVersion: number;
  firmwareVersion: number;
  parameters: Array<string>;
  sharedWith: Array<Types.ObjectId>;
  isShared: boolean;
  costOfUse: number;
  location: { coordinates: number[]; type: string } | string;
  geometry: string;
  insertedBy: string;
  insertDate: string;
  isDeletable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
  updatedBy: string;
  updateDate: string;
}
