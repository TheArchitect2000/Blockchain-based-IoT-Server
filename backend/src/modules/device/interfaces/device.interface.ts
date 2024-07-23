import { Document } from 'mongoose';

export interface Device extends Document {
  userId: string;
  deviceName: string;
  deviceType: string;
  password: string;
  mac: string;
  deviceEncryptedId: string;
  hardwareVersion: number;
  firmwareVersion: number;
  parameters: [];
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
