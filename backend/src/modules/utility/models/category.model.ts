import { Model } from 'mongoose';
import { Category } from '../interfaces/category.interface';

export interface CategoryModel extends Model<Category> {
  [x: string]: any;
}
