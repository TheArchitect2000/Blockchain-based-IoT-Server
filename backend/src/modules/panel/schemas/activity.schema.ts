import { Schema } from 'mongoose';

const schema = new Schema({
  DEVICE_STATUS: {
    type: String,
    minlength: 1,
    required: false,
  },
  Temperature: {
    type: Number,
    required: false,
  },
  Humidity: {
    type: Number,
    required: false,
  },
  Door: {
    type: String,
    minlength: 1,
    required: false,
  },
  Movement: {
    type: String,
    minlength: 1,
    required: false,
  },
  Button: {
    type: String,
    minlength: 1,
    required: false,
  },
  Battery: {
    type: Number,
    required: false,
  },
  Interval: {
    type: Number,
    required: false,
  },
  Current: {
    type: Number,
    required: false,
  },
  State: {
    type: String,
    minlength: 1,
    required: false,
  },
  Voltage: {
    type: Number,
    required: false,
  },
  FV: {
    type: Number,
    required: false,
  },
  HV: {
    type: Number,
    required: false,
  },
  DeviceId: {
    type: Schema.Types.ObjectId,
    ref: 'iadevice',
    required: false,
  },
  isDevice: {
    type: Boolean,
    required: false,
  },
  needpassword: {
    type: Boolean,
    required: false,
  },
  HomeId: {
    type: Schema.Types.ObjectId,
    ref: 'iahome',
    required: false,
    default: null,
  },
  authorized: {
    type: Boolean,
    required: false,
  },
  RESET: {
    type: Number,
    required: false,
  },
  YOUR_DEVICEID: {
    type: String,
    minlength: 1,
    required: false,
  },
  YOUR_PASSWORD: {
    type: String,
    minlength: 1,
    required: false,
  },
  DeviceEncId: {
    type: String,
    minlength: 1,
    required: false,
  },
  event: {
    type: String,
    minlength: 1,
  },
  username: {
    type: String,
    minlength: 1,
  },
  __receivetime: {
    type: Number,
    required: false,
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
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const activitySchema = schema;
