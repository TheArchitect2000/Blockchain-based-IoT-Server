import { deviceTypeSchema } from '../schemas/device-type.schema';

export const deviceTypeFeature = [
  { name: 'device-type', schema: deviceTypeSchema }, // The name of device must be the same in @InjectModel in repository and service
];
