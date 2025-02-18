import { Schema } from 'mongoose';
import { UserActivationStatusEnum } from '../enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from '../enums/user-verification-status.enum';

const schema = new Schema({
  firstName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  lastName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  company: {
    type: Object,
    required: false,
    default: {},
  },
  tel: {
    type: Object,
    required: false,
    default: {},
  },
  address: {
    type: Object,
    required: false,
    default: {},
  },
  email: {
    type: String,
    unique: true,
    required: false,
    default: null,
  },
  timezone: {
    type: String,
    required: false,
    default: null,
  },
  google: {
    type: Boolean,
    required: false,
    default: false,
    immutable: true,
  },
  password: {
    minlength: 6,
    type: String,
    required: false,
    default: null,
  },
  newPassword: {
    minlength: 6,
    type: String,
    required: false,
    default: null,
  },
  StorX: {
    type: Object,
    required: false,
    default: {},
  },
  walletAddress: {
    minlength: 6,
    type: String,
    required: false,
    default: null,
  },
  firebaseToken: String,
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user-role',
      required: false,
      default: null,
    },
  ],
  info: {
    type: Object,
    ref: 'user-info',
    required: false,
    default: {},
  },
  activationStatus: {
    type: String,
    required: false,
    default: UserActivationStatusEnum.INACTIVE,
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
    default: UserVerificationStatusEnum.UNVERIFIED,
  },
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
  unsubscribed: {
    type: Boolean,
    required: false,
    default: false,
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
  lastLogin: {
    type: Date,
    required: false,
    default: null,
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
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  lang: {
    type: String,
    required: false,
    default: '',
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
});

const emailTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  newEmail: {
    type: String,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

emailTokenSchema.plugin(require('mongoose-paginate-v2'));
emailTokenSchema.plugin(require('mongoose-aggregate-paginate-v2'));
emailTokenSchema.index({ '$**': 'text' });

export const userSchema = schema;

export const changeEmailTokenSchema = emailTokenSchema;
