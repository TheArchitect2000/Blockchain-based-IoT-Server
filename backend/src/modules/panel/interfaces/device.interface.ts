import { Document } from 'mongoose';

export interface Device extends Document {
  Removed: boolean;
  HomeId: string;
  Name: string;
  GPS: string;
  Password: string;
  IsActive: boolean;
  DeviceType: string;
  createdAt: string;
  updatedAt: string;
  RemoveTime: string;
  MAC: string;
}
