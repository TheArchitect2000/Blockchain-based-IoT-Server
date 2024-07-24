import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';

export interface UserModel extends Model<User> {
  [x: string]: any;
}
