import { Model } from 'mongoose';
import { Customer } from '../interfaces/customer.interface';

export interface CustomerModel extends Model<Customer> {
  [x: string]: any;
}
