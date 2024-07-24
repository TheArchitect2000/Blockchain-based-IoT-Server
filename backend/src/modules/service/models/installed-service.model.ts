import { Model } from 'mongoose';
import { InstalledService } from '../interfaces/installed-service.interface';

export interface InstalledServiceModel extends Model<InstalledService> {
  [x: string]: any;
}
