import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { OTPException } from '../exceptions/otp.exception';
import { OTPModel } from '../models/otp.model';

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

  async findOTPByEmail(userEmail, otpType) {
    return await this.otpModel
      .find({ email: userEmail })
      .where({ type: otpType, verify: false });
  }

  async findOTP(userMobile, otpType) {
    return await this.otpModel
      .find({ mobile: userMobile })
      .where({ type: otpType, verify: false });
  }
}
