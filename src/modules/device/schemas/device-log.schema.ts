import { Schema } from 'mongoose';

const schema = new Schema({
  event: {
    type: String,
    minlength: 1,
    required: false,
  },
  data: {
    type: {},
    minlength: 1,
    required: false,
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'device',
    required: false,
  },
  deviceEncryptedId: {
    type: String,
    minlength: 1,
    required: false,
  },
  senderDeviceEncryptedId: {
    type: String,
    minlength: 1,
    required: false,
  },
  insertDate: {
    type: Date,
    required: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });

export const deviceLogSchema = schema;
