import { Schema } from 'mongoose';
import { ActivationStatusEnum } from '../enums/activation-status.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  deviceBrand: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  deviceName: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  osName: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  osVersion: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  browserName: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  browserType: {
    type: String,
    minlength: 2,
    required: false,
    default: null,
  },
  browserVersion: {
    type: String,
    minlength: 2,
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
    default: null,
  },
  deletable: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
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
    default: null,
  },
  deletionReason: {
    type: String,
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
    default: null,
  },
});

// schema.index({ '$**': 'text' });

export const deviceLogSchema = schema;
