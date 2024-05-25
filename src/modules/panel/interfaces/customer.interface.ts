import { Document } from 'mongoose';

export interface Customer extends Document {
  IsActive: boolean;
  Email: string;
  Username: string;
  Password: string;
  NewPassword: string;
  FirstName: string;
  LastName: string;
  Mobile: string;
  createdAt: string;
  updatedAt: string;
}
