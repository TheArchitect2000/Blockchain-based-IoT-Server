import { Document } from 'mongoose';

export interface Media extends Document {
  user: string;
  type: string;
  encoding: string;
  mediaType: string;
  destination: string;
  fileName: string;
  path: string;
  size: number;
  collectionName: string;
  collectionId: string;
  insertedBy: string;
  insertDate: string;
  activationStatus: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
  verificationStatus: string;
  verificationStatusMessage: string;
  verificationStatusChangedBy: string;
  verificationStatusChangeDate: string;
  deletable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
  updatedBy: string;
  updateDate: string;
}
