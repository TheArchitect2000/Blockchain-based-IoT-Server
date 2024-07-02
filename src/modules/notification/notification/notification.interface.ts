import { Document } from 'mongoose';

export interface Notification extends Document {
  title: string
  message: string
  userId: string
  seen: boolean
  public: boolean
  expiryDate: string
  insertedBy: string
  insertDate: string
}
