import { Document } from 'mongoose';

export default type NotifTypes = 'notification' | 'ticket';


export interface Notification extends Document {
  title: string
  message: string
  userId: string
  read: boolean
  type: NotifTypes
  detail: object
  public: boolean
  expiryDate: Date
  insertedBy: string
  insertDate: Date
}
