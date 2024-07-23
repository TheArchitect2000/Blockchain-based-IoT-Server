import { Model } from 'mongoose';
import { UserPermission } from '../interfaces/user-permission.interface';

export interface UserPermissionModel extends Model<UserPermission> {
  [x: string]: any;
}
