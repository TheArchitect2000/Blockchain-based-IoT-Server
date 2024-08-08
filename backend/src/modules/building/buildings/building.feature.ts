import { BuildingSchema } from './building.schema';

export const buildingFeature = [
  { name: 'building', schema: BuildingSchema }, // The name offeature must be the same in @InjectModel in repository and service
];
