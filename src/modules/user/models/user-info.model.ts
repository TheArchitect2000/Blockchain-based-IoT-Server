import { Model } from 'mongoose';
import { UserInfo } from '../interfaces/user-info.interface';

export interface UserInfoModel extends Model<UserInfo> {
  [x: string]: any;
}
