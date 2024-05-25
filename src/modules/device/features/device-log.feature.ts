import { deviceLogSchema } from '../schemas/device-log.schema';

export const deviceLogFeature = [
  { name: 'device-log', schema: deviceLogSchema }, // The name of device-type must be the same in @InjectModel in repository and service
];
