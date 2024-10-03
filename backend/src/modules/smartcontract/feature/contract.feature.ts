import { contractSchema } from "../schema/contract.schema";

export const contractFeature = [
  { name: 'contract', schema: contractSchema }, // The name of device must be the same in @InjectModel in repository and service
];
