import { installedServiceSchema } from '../schemas/installed-service.schema';

export const installedServiceFeature = [
  { name: 'installed-service', schema: installedServiceSchema }, // The name of device must be the same in @InjectModel in repository and service
];
