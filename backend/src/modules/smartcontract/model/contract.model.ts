import { Model } from 'mongoose';
import { Contract } from '../interface/contract.interface';


export interface ContractModel extends Model<Contract> {
  [x: string]: any;
}
