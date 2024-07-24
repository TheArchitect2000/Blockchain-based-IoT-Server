import { activitySchema } from '../schemas/activity.schema';

export const activityFeature = [
  { name: 'iaactivity', schema: activitySchema }, // The name of iadevice must be the same in @InjectModel in repository and service
];
