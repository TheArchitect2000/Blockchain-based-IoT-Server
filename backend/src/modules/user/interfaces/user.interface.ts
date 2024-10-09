import { Document } from 'mongoose';

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  tel: Object;
  address: Object;
  timezone: string;
  email: string;
  password: string;
  unsubscribed: boolean;
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
