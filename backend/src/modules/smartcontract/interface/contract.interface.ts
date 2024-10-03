import { Document } from 'mongoose';

export interface Contract extends Document {
  userId: string;
  manufacturerName: string;
  deviceType: string;
  hardwareVersion: string;
  firmwareVersion: string;
  lines: string;
  commitmentData: string;
}
