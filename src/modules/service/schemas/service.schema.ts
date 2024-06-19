import { Schema } from 'mongoose';

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: null,
  },
  serviceName: {
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
  serviceType: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  status: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  /* devices: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'device', 
        required: false, 
        default: null 
    }], */
  devices: {
    type: [],
    minlength: 1,
    required: false,
    default: null,
  },
  numberOfInstallations: {
    type: Number,
    required: false,
    default: 0,
  },
  installationPrice: {
    type: Number,
    required: false,
    default: 0,
  },
  runningPrice: {
    type: Number,
    required: false,
    default: 0,
  },
  rate: {
    type: Number,
    required: false,
    default: 0,
  },
  serviceImage: {
    type: String,
    ref: "media",
    minlength: 0,
    required: false,
    default: null,
  },
  blocklyJson: {
    type: {},
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
  publishRejected: {
    type: Boolean,
    required: false,
    default: false,
  },
  published: {
    type: Boolean,
    required: false,
    default: false,
  },
  publishRequested: {
    type: Boolean,
    required: false,
    default: false,
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

export const serviceSchema = schema;
