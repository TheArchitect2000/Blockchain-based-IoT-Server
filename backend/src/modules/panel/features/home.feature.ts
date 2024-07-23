import { homeSchema } from '../schemas/home.schema';

export const homeFeature = [
  { name: 'iahome', schema: homeSchema }, // The name of iahome must be the same in @InjectModel in repository and service
];
