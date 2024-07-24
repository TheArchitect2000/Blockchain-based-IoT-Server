import { Model } from 'mongoose';
import { Tag } from '../interfaces/tag.interface';

export interface TagModel extends Model<Tag> {
  [x: string]: any;
}
