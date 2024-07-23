import { Document } from 'mongoose';

export interface DeviceType extends Document {
  OTA: string;
  Controllers: string;
  Published: boolean;
  Active: boolean;
  DeviceType: string;
  DeviceName: string;
  Type: string;
  Data: string[];
  Commands: string[];
  CommandType: string;
  VersionNo: number;
  createdAt: string;
  updatedAt: string;
}
