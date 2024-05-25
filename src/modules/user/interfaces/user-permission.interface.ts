import { Document } from 'mongoose';

export interface UserPermission extends Document {
  name: string;
  module: string;
  label: string;
  description: string;
  routes: string[];
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
