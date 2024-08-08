import { Model } from 'mongoose';
import { Building } from './building.interface';

export interface BuildingModel extends Model<Building> {
  [x: string]: any;
}
