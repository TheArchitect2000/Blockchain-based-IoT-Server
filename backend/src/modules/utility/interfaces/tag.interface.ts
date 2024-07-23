import { Document } from 'mongoose';

export interface Tag extends Document {
  name: string;
  activationStatus: string;
  activationStatusChangeReason: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
  verificationStatus: string;
  verificationStatusChangeReason: string;
  verificationStatusChangedBy: string;
  verificationStatusChangeDate: string;
  insertedBy: string;
  insertDate: string;
  updatedBy: string;
  updateDate: string;
  isDeletable: boolean;
  deletable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
}
