import { Schema } from 'mongoose';
import { RoleActivationStatusEnum } from '../enums/role-activation-status.enum';
import { UserActivationStatusEnum } from '../enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from '../enums/user-verification-status.enum';

const schema = new Schema({
  department: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user-permission',
      required: false,
      default: null,
    },
  ],
  activationStatus: {
    type: String,
    required: false,
    default: UserActivationStatusEnum.ACTIVE,
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
  deletable: {
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
});

// schema.index({ '$**': 'text' });

export const userRoleSchema = schema;
