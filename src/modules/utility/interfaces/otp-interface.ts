import { Document } from 'mongoose';
export interface OTP extends Document {
  type: string;
  mobile: string;
  email: string;
  sentCode: string;
  issueDate: string;
  expiryDate: string;
  verificationStatus: string;
  insertedBy: string;
  insertDate: string;
  updatedBy: string;
  updateDate: string;
  isdeleted: boolean;
  deletedBy: string;
  deleteDate: string;
  deletionReason: string;
}
