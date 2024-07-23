import { deviceSchema } from '../schemas/device.schema';

export const deviceFeature = [
  { name: 'device', schema: deviceSchema }, // The name of device must be the same in @InjectModel in repository and service
];
