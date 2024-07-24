import { Schema } from 'mongoose';

const schema = new Schema({
  IsActive: {
    type: Boolean,
    required: false,
    default: false,
  },
  Email: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  Username: {
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
  NewPassword: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  FirstName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  LastName: {
    type: String,
    minlength: 1,
    required: false,
    default: null,
  },
  Mobile: {
    type: String,
    // unique: true,
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
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const customerSchema = schema;
