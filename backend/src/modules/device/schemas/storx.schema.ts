import { Schema } from 'mongoose';

const storxSchema = new Schema({
  userId: { type: String, required: true },
  accessGrant: { type: String, required: true },
  accessKeyId: { type: String },
  secretKey: { type: String },
  endpoint: { type: String },
});

export { storxSchema };
