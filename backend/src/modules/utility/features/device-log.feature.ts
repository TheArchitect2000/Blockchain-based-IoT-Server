import { deviceLogSchema } from '../schemas/device-log.schema';

export const deviceLogFeature = [
  { name: 'device_log', schema: deviceLogSchema }, // The name of otp must be the same in @InjectModel in repository and service
];
