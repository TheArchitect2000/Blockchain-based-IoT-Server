import { Schema } from 'mongoose';

const schema = new Schema({
  OTA: {
    Releases: [
      {
        Version: { type: Number },
        Series: { type: Number },
        Time: { type: Date },
        Size: { type: Number },
      },
    ],
    Series: { type: Number },
    Time: { type: Date },
    Version: { type: Number },
  },
  Controllers: {
    type: String,
  },
  Published: {
    type: Boolean,
    required: false,
    default: false,
  },
  Active: {
    type: Boolean,
    required: false,
    default: false,
  },
  DeviceType: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  DeviceName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  Type: {
    type: String,
    enum: ['SENSOR', 'ACTUATOR'],
  },
  Data: [
    {
      Name: String, //for example state, current, state2
      Type: { type: String, enum: ['String', 'Number'] },
      Enum: [String],
      iconclass: String,
      Unit: String,
      isOption: Boolean,
    },
  ],
  Commands: [
    {
      Command: String,
      Title: String,
      State: String,
    },
  ],
  CommandType: {
    type: String,
    enum: ['switch', 'button', 'radio', 'switch', 'check', 'voice'],
  },
  VersionNo: {
    type: Number,
    required: false,
    default: 0,
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

export const deviceTypeSchema = schema;
