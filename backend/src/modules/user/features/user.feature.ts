import { userSchema } from '../schemas/user.schema';

export const userFeature = [
  { name: 'user', schema: userSchema }, // The name of user must be the same in @InjectModel in repository and service
];
