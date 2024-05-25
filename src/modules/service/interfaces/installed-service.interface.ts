import { Document } from 'mongoose';

export interface InstalledService extends Document {
  userId: string;
  serviceId: string;
  installedServiceName: string;
  description: string;
  code: string;
  deviceMap: string;
  installedServiceImage: string;
  activationStatus: string;
  activationStatusChangeReason: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
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
