import { userPermissionSchema } from '../schemas/user-permission.schema';

export const userPermissionFeature = [
  { name: 'user-permission', schema: userPermissionSchema }, // The name of user-permission must be the same in @InjectModel in repository and service
];
