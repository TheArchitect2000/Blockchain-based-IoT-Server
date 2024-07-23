import { deviceSchema } from '../schemas/device.schema';

export const deviceFeature = [
  { name: 'iadevice', schema: deviceSchema }, // The name of iadevice must be the same in @InjectModel in repository and service
];
