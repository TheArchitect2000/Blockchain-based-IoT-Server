import { Schema } from 'mongoose';
import { OTPTypeEnum } from '../enums/otp-type.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

const schema = new Schema({
  type: {
    type: String,
    required: false,
    default: OTPTypeEnum.REGISTRATION,
  },
  mobile: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: true,
    default: null,
  },
  sentCode: {
    type: String,
    required: false,
  },
  issueDate: {
    type: Date,
    required: true,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: true,
    default: null,
  },
  verificationStatus: {
    type: String,
    required: false,
    default: VerificationStatusEnum.UNVERIFIED,
  },
  verificationStatusChangeReason: {
    type: String,
    required: false,
    default: null,
  },
  verificationStatusChangeDate: {
    type: Date,
    required: false,
    default: null,
  },
  insertedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  insertDate: {
    type: Date,
    required: true,
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  updateDate: {
    type: Date,
    required: false,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  deleteDate: {
    type: Date,
    default: null,
  },
  deletionReason: {
    type: String,
    default: null,
  },
});

export const otpSchema = schema;
