import { Document } from 'mongoose';

export interface UserRole extends Document {
  department: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  insertedBy: string;
  insertDate: string;
  activationStatus: string;
  activationStatusChangeReason: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
  deletable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
  updatedBy: string;
  updateDate: string;
}
