import { Document } from 'mongoose';

export interface Building extends Document {
  name: string;
  details: object;
  createdBy: string;
  insertDate: Date;
  updateDate: Date;
}
