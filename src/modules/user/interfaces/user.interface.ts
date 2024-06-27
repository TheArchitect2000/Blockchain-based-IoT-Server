import { Document } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  mobile: string;
  email: string;
  password: string;
  newPassword: string;
  walletAddress: string;
  roles: string[];
  StorX: Object;
  info: Object;
  insertedBy: string;
  insertDate: string;
  activationStatus: string;
  firebaseToken: string;
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
