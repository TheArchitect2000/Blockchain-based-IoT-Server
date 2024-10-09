import { Model } from 'mongoose';
import { UserInterface } from '../interfaces/user.interface';

export interface UserModel extends Model<UserInterface> {
  [x: string]: any;
}
