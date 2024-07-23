import { deviceTypeSchema } from '../schemas/device-type.schema';

export const deviceTypeFeature = [
  { name: 'iadevicetype', schema: deviceTypeSchema }, // The name of iadevice must be the same in @InjectModel in repository and service
];
