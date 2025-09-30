import { Model } from 'mongoose';
import {
  UserChangeEmailTokenInterface,
  UserInterface,
} from '../interfaces/user.interface';

export interface UserModel extends Model<UserInterface> {
  [x: string]: any;
}

export interface ChangeEmailTokenModel
  extends Model<UserChangeEmailTokenInterface> {
  [x: string]: any;
}
