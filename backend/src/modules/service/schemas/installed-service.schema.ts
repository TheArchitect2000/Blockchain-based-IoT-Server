import { Schema } from 'mongoose';
import { InstalledServiceActivationStatusEnum } from '../enums/installed-service-activation-status.enum';

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: null,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'service',
    required: true,
    default: null,
  },
  installedServiceName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  description: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  code: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  deviceMap: {
    type: {},
    minlength: 1,
    required: false,
  },
  /* devices: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'device', 
        required: false, 
        default: null 
    }], */
  /* devices: { 
        type: [], 
        minlength: 1, 
        required: false
    }, */
  installedServiceImage: {
    type: String,
    default: null,
    required: false,
  },
  activationStatus: {
    type: String,
    required: false,
    default: InstalledServiceActivationStatusEnum.ACTIVE,
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
    required: false,
    default: null,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const installedServiceSchema = schema;
