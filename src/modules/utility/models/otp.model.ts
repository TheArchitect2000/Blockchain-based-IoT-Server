import { Model } from 'mongoose';
import { OTP } from '../interfaces/otp-interface';

export interface OTPModel extends Model<OTP> {
  [x: string]: any;
}
