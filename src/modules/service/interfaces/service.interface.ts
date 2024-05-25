import { Document } from 'mongoose';

export interface Service extends Document {
  userId: string;
  serviceName: string;
  description: string;
  serviceType: string;
  status: string;
  devices: [];
  numberOfInstallations: number;
  installationPrice: number;
  runningPrice: number;
  rate: number;
  serviceImage: string;
  blocklyJson: string;
  code: string;
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
