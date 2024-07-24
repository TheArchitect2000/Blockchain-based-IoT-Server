import { Document } from 'mongoose';

export interface Activity extends Document {
  DEVICE_STATUS: string;
  Temperature: number;
  Humidity: number;
  Door: string;
  Movement: string;
  Button: string;
  Battery: number;
  Interval: number;
  Current: number;
  State: string;
  Voltage: number;
  FV: number;
  HV: number;
  DeviceId: string;
  isDevice: boolean;
  needpassword: boolean;
  HomeId: string;
  authorized: boolean;
  RESET: number;
  YOUR_DEVICEID: string;
  YOUR_PASSWORD: string;
  DeviceEncId: string;
  event: string;
  username: string;
  __receivetime: number;
  createdAt: string;
  updatedAt: string;
}
