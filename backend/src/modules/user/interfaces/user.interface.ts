import { Document } from 'mongoose';

export interface UserChangeEmailTokenInterface extends Document {
  userId: string;
  newEmail: string;
  token: string;
  expireDate: Date;
}

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  company: Object;
  mobile: string | number;
  tel: Object;
  address: Object;
  timezone: string;
  google: boolean;
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
  lastLogin: string;
}
