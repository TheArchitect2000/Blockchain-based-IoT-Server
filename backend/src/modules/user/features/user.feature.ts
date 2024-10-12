import { changeEmailTokenSchema, userSchema } from '../schemas/user.schema';

export const userFeature = [
  { name: 'user', schema: userSchema },
  { name: 'email-token', schema: changeEmailTokenSchema },
];
