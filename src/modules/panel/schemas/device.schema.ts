import { Schema } from 'mongoose';

const schema = new Schema({
  Removed: {
    type: Boolean,
    required: false,
    default: false,
  },
  HomeId: {
    type: Schema.Types.ObjectId,
    ref: 'iahome',
    required: false,
    default: null,
  },
  Name: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  GPS: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  Password: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  IsActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  DeviceType: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  createdAt: {
    type: Date,
    required: false,
    default: null,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: null,
  },
  RemoveTime: {
    type: Date,
    required: false,
    default: null,
  },
  MAC: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const deviceSchema = schema;
