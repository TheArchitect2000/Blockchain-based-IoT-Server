import { otpSchema } from '../schemas/otp.schema';

export const otpFeature = [
  { name: 'otp', schema: otpSchema }, // The name of otp must be the same in @InjectModel in repository and service
];
