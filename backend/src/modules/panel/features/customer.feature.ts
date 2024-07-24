import { customerSchema } from '../schemas/customer.schema';

export const customerFeature = [
  { name: 'iacustomer', schema: customerSchema }, // The name of iacustomer must be the same in @InjectModel in repository and service
];
