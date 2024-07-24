import { userRoleSchema } from '../schemas/user-role.schema';

export const userRoleFeature = [
  { name: 'user-role', schema: userRoleSchema }, // The name of user-role must be the same in @InjectModel in repository and service
];
