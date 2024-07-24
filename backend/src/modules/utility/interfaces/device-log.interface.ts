import { Document } from 'mongoose';

export interface DeviceLog extends Document {
  user: string;
  ip: string;
  deviceType: string;
  deviceBrand: string;
  deviceName: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  insertedBy: string;
  insertDate: string;
  deletable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
  updatedBy: string;
  updateDate: string;
}
