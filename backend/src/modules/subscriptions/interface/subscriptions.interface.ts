import { Document } from 'mongoose';

export interface Subscriptions extends Document {
  userId: string;
  token: string;
}
