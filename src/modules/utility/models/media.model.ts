import { Model } from 'mongoose';
import { Media } from '../interfaces/media.interface';

export interface MediaModel extends Model<Media> {
  [x: string]: any;
}
