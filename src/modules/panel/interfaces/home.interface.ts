import { Document } from 'mongoose';

export interface Home extends Document {
  Address: string;
  CustomerId: string;
  Name: string;
  Type: string;
  IsActive: boolean;
  Guard: boolean;
  createdAt: string;
  updatedAt: string;
  Timezone: string;
}
