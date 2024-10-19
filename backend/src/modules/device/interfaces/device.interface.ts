import { Document } from 'mongoose';

export interface Device extends Document {
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
  sharedWith: Array<string>;
  isShared: boolean;
  costOfUse: number;
  location: string;
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
