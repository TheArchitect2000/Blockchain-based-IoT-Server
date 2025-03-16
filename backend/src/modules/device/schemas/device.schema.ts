import { Schema } from 'mongoose';

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null,
  },
  nodeId: {
    type: String,
    required: false,
    default: null,
  },
  nodeDeviceId: {
    type: String,
    required: false,
    default: null,
  },
  deviceName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  deviceType: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  password: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  mac: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  deviceEncryptedId: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  hardwareVersion: {
    type: Number,
    required: false,
    default: 0,
  },
  firmwareVersion: {
    type: Number,
    required: false,
    default: 0,
  },
  parameters: {
    type: [],
    minlength: 1,
    required: false,
  },
  sharedWith: {
    type: [],
    required: false,
    default: [],
  },
  isShared: {
    type: Boolean,
    required: false,
    default: false,
  },
  costOfUse: {
    type: Number,
    required: false,
    default: 0,
  },
  // GeoJSON Objects
  location: {
    type: {
      type: String,
      enum: ['Point', 'Other'],
    },
    coordinates: { type: [Number] },
  },
  // GeoJSON Objects
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'Other'],
    },
    coordinates: [[Number]],
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

export const deviceSchema = schema;
