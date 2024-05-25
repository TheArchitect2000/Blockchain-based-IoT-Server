import { Schema } from 'mongoose';

const schema = new Schema({
  Address: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  CustomerId: {
    type: Schema.Types.ObjectId,
    ref: 'iacustomer',
    required: false,
    default: null,
  },
  Name: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  Type: {
    // Type: HOME, OFFICE
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
  Guard: {
    type: Boolean,
    required: false,
    default: false,
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
  Timezone: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const homeSchema = schema;
