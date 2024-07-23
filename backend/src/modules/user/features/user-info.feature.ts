import { userInfoSchema } from '../schemas/user-info.schema';

export const userInfoFeature = [
  { name: 'user-info', schema: userInfoSchema }, // The name of user must be the same in @InjectModel in repository and service
];
