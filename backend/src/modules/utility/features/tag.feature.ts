import { tagSchema } from '../schemas/tag.schema';

export const tagFeature = [
  { name: 'tag', schema: tagSchema }, // The name of user must be the same in @InjectModel in repository and service
];
