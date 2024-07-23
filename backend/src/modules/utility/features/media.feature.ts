import { mediaSchema } from '../schemas/media.schema';

export const mediaFeature = [
  { name: 'media', schema: mediaSchema }, // The name of otp must be the same in @InjectModel in repository and service
];
