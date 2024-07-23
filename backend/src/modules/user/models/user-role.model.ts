import { Model } from 'mongoose';
import { UserRole } from '../interfaces/user-role.interface';

export interface UserRoleModel extends Model<UserRole> {
  [x: string]: any;
}
