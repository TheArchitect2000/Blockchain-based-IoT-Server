import { Model } from 'mongoose';
import { Storx } from '../interfaces/storx.interface';

export interface StorxModel extends Model<Storx> {
  [x: string]: any;
}
