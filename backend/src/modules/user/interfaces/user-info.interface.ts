import { Document } from 'mongoose';

export interface UserInfo extends Document {
  user: string;
  nickName: string;
  fatherName: string;
  website: string;
  biography: string;
  // photo: string;
  // educationalCertifacate: string;
  nationalCode: string;
  insertedBy: string;
  insertDate: string;
  activationStatus: string;
  activationStatusChangeReason: string;
  activationStatusChangedBy: string;
  activationStatusChangeDate: string;
  verificationStatus: string;
  verificationStatusChangeReason: string;
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
