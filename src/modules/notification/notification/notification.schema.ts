import { Schema } from 'mongoose';


const schema = new Schema({
  title: {
    type: String,
    required: true,
    default: '',
  },
  message: {
    type: String,
    required: true,
    default: '',
  },
  type: {
    type: String,
    required: false,
    default: 'notification',
  },
  detail: {
    type: Object,
    required: false,
    default: {},
  },
  userId: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    required: false,
    default: false,
  },
  insertedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  insertDate: {
    type: Date,
    required: true,
  },
  read: {
    type: Boolean,
    required: false,
    default: false,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });


export const NotificationSchema = schema;
