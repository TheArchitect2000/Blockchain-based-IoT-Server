import { Schema } from 'mongoose';
import { ActivationStatusEnum } from 'src/modules/utility/enums/activation-status.enum';
import { VerificationStatusEnum } from 'src/modules/utility/enums/verification-status.enum';

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: false,
  },
  type: {
    type: String,
    required: true,
  },
  encoding: {
    type: String,
    required: false,
    default: null,
  },
  mediaType: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    unique: true,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  collectionName: {
    type: String,
    required: false,
    default: null,
  },
  collectionId: {
    type: Schema.Types.ObjectId,
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
  activationStatus: {
    type: String,
    default: ActivationStatusEnum.ACTIVE,
  },
  activationStatusChangedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null,
  },
  activationStatusChangeDate: {
    type: Date,
    default: null,
  },
  verificationStatus: {
    type: String,
    required: false,
    default: VerificationStatusEnum.UNVERIFIED,
  },
  verificationStatusMessage: {
    type: Date,
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
    default: null,
  },
  isDeletable: {
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

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const mediaSchema = schema;
