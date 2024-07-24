import { serviceSchema } from '../schemas/service.schema';

export const serviceFeature = [
  { name: 'service', schema: serviceSchema }, // The name of device must be the same in @InjectModel in repository and service
];
