import { Schema } from 'mongoose';
import { ActivationStatusEnum } from '../enums/activation-status.enum';
import { categoryTypeEnum } from '../enums/category-type.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

const schema = new Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: false,
    default: categoryTypeEnum.MAIN,
  },
  sort: {
    type: Number,
    default: 1,
    required: false,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'media',
    required: false,
    default: null,
  },
  content: { type: String, required: false, default: null },
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
  activationStatus: {
    type: String,
    required: false,
    default: ActivationStatusEnum.ACTIVE,
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
    default: VerificationStatusEnum.UNVERIFIED,
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
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const categorySchema = schema;
