import { categorySchema } from '../schemas/category.schema';

export const categoryFeature = [
  { name: 'category', schema: categorySchema }, // The name of user must be the same in @InjectModel in repository and service
];
