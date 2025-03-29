import { Document } from 'mongoose';

export interface Contract extends Document {
  createdAt: Date;
  transactionId: string;
  commitmentId: string;
  nodeId: string;
  userId: string;
  manufacturer: string;
  deviceType: string;
  deviceIdType: string;
  deviceModel: string;
  softwareVersion: string;
  commitmentData: string;
}
