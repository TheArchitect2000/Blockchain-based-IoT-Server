import { Schema } from 'mongoose';

const schema = new Schema({
  transactionId: {
    type: String,
    required: true,
  },
  commitmentId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: null,
  },
  nodeId: {
    type: String,
    required: true,
  },
  manufacturerName: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  hardwareVersion: {
    type: String,
    required: true,
  },
  firmwareVersion: {
    type: String,
    required: true,
  },
  commitmentData: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
    immutable: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const contractSchema = schema;
