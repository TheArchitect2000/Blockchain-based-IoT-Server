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
  manufacturer: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  deviceIdType: {
    type: String,
    required: true,
  },
  deviceModel: {
    type: String,
    required: true,
  },
  softwareVersion: {
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
