import { Schema } from 'mongoose';
import { UserActivationStatusEnum } from '../enums/user-activation-status.enum';
import { UserInfoActicationStatusEnum } from '../enums/user-info-activation-status.enum';
import { UserVerificationStatusEnum } from '../enums/user-verification-status.enum';

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  nationalCode: { type: Number, unique: true, required: false, default: null },
  levelOfEducation: { type: String, required: false, default: '' },
  nickName: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  fatherName: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  website: {
    type: String,
    required: false,
    default: null,
  },
  telephone: {
    type: String,
    required: false,
    default: null,
  },
  fax: {
    type: String,
    required: false,
    default: null,
  },
  biography: {
    type: String,
    required: false,
    default: null,
  },
  profileImage: {
    type: Schema.Types.ObjectId,
    ref: 'media',
    default: null,
    required: false,
  },
  headerImage: {
    type: Schema.Types.ObjectId,
    ref: 'media',
    default: null,
    required: false,
  },
  activationStatus: {
    type: String,
    required: false,
    default: '',
  },
  activationStatusChangeReason: {
    type: String,
    required: false,
    default: null,
  },
  activationStatusChangedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null,
  },
  activationStatusChangeDate: {
    type: Date,
    required: false,
    default: null,
  },
  verificationStatus: {
    type: String,
    required: false,
    default: '',
  }, // verfied, unverified, pending
  verificationStatusChangeReason: {
    type: String,
    required: false,
    default: null,
  },
  verificationStatusChangedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
    ref: 'user',
    required: false,
    default: null,
  },
  insertDate: {
    type: Date,
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null,
  },
  updateDate: {
    type: Date,
    required: true,
  },
  isDeletable: {
    type: Boolean,
    required: false,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null,
  },
  deleteDate: {
    type: Date,
    required: false,
    default: null,
  },
  deletionReason: {
    type: String,
    required: false,
    default: null,
  },
});

export const userInfoSchema = schema;
