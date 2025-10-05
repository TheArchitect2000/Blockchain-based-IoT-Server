import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { OTPException } from '../exceptions/otp.exception';
import { OTPModel } from '../models/otp.model';
import { DeleteResult } from 'mongoose';

@Injectable()
export class OTPRepository {
  private result;

  constructor(
    @InjectModel('otp')
    private readonly otpModel?: OTPModel,
  ) {}

  async insertOTP(data) {
    return await this.otpModel.create(data);
  }

  async editOTP(id, editedData) {
    return await this.otpModel.updateOne({ _id: id }, editedData);
  }

  async deleteOTP(id): Promise<DeleteResult> {
    return await this.otpModel.deleteOne({ _id: id });
  }

  async findOTPByEmail(userEmail, otpType) {
    const nowDate = new Date();
    return await this.otpModel
      .find({ email: userEmail })
      .where({ type: otpType, expiryDate: { $gte: nowDate } });
  }

  async findOTPById(otpId, otpType) {
    const nowDate = new Date();
    return await this.otpModel
      .find({ _id: otpId })
      .where({ type: otpType, expiryDate: { $gte: nowDate } });
  }

  async findOTP(userMobile, otpType) {
    const nowDate = new Date();
    return await this.otpModel
      .find({ mobile: userMobile })
      .where({ type: otpType, expiryDate: { $gte: nowDate } });
  }
}
