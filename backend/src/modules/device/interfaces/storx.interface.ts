import { Document } from 'mongoose';

export interface Storx extends Document {
  accessGrant: string;
}
