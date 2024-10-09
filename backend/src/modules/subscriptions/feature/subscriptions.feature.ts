import { subscriptionSchema } from '../schema/subscriptions.schema';

export const subscriptionFeature = [
  { name: 'Subscription', schema: subscriptionSchema }, // The name of device must be the same in @InjectModel in repository and service
];
