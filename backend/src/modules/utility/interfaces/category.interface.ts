import { Document } from 'mongoose';

export interface Category extends Document {
  name: string;
  type: string;
  sort: number;
  parent: string;
  description: string;
  image: string;
  content: string;
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
  activationStatus: string;
  activationStatusChangeReason: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
  verificationStatus: string;
  verificationStatusChangeReason: string;
  verificationStatusChangedBy: string;
  verificationStatusChangeDate: string;
}
