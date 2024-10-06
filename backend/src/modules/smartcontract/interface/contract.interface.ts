import { Document } from 'mongoose';

export interface Contract extends Document {
  userId: string;
  nodeId: string;
  manufacturerName: string;
  deviceName: string;
  deviceType: string;
  hardwareVersion: string;
  firmwareVersion: string;
  lines: string;
  commitmentData: string;
}
