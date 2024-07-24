import { Model } from 'mongoose';
import { Home } from '../interfaces/home.interface';

export interface HomeModel extends Model<Home> {
  [x: string]: any;
}
