import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { OTPException } from "../exceptions/otp.exception";
import { GeneralException } from '../exceptions/general.exception';
import { OTP } from '../interfaces/otp-interface';
import { OTPModel } from '../models/otp.model';
import { OTPRepository } from '../repositories/otp.repository';
import { SMSService } from './sms.service';
import * as bcrypt from 'bcrypt';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { MailService } from './mail.service';
import { OTPTypeEnum } from '../enums/otp-type.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

/**
 * One Time Password Service.
 */
const saltRounds = 10;

@Injectable()
export class OTPService {
  private result;
  private otp;

  constructor(
    @InjectModel('otp')
    private readonly otpModel?: OTPModel,
    private readonly repository?: OTPRepository,
    private readonly smsService?: SMSService,
    private readonly mailService?: MailService,
  ) {}

  async insertOTPCode(type, email) {
    const randomNumber =
      Math.floor(Math.floor(100000 + Math.random() * 900000)) + 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashRandomNumber = bcrypt.hashSync(String(randomNumber), salt);

    let expiryDate = new Date().setMinutes(new Date().getMinutes() + 5); // 5 minutes exire time for otp

    let newOTP = {
      type: type,
      email: email,
      sentCode: hashRandomNumber,
      issueDate: new Date(),
      expiryDate: expiryDate,
      insertedBy: null,
      insertDate: new Date(),
    };

    this.otp = await this.repository.insertOTP(newOTP);

    return randomNumber.toString() as string;
  }

  async insertEmailOTP(type, email): Promise<any> {
    const randomNumber =
      Math.floor(Math.floor(100000 + Math.random() * 900000)) + 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashRandomNumber = bcrypt.hashSync(String(randomNumber), salt);

    let expiryDate = new Date().setMinutes(new Date().getMinutes() + 5); // 5 minutes exire time for otp

    let newOTP = {
      type: type,
      email: email,
      sentCode: hashRandomNumber,
      issueDate: new Date(),
      expiryDate: expiryDate,
      insertedBy: null,
      insertDate: new Date(),
    };

    this.otp = await this.repository.insertOTP(newOTP);

    if (this.otp) {
      if (type === OTPTypeEnum.REGISTRATION) {
        return await this.mailService.sendRegistrationOTP(
          email,
          randomNumber.toString(),
          type,
        );
      } else if (type === OTPTypeEnum.CHANGE_PASSWORD) {
        return await this.mailService.sendChangePasswordOTP(
          email,
          randomNumber.toString(),
          type,
        );
      } else if (type === OTPTypeEnum.Verify) {
        return await this.mailService.sendVerifyEmailOTP(
          email,
          randomNumber.toString(),
          type,
        );
      }
    } else {
      throw new GeneralException(
        410,
        'An error occurred while sending the otp code. Please try again later.',
      );
    }
  }

  async insertOTP(type, mobile): Promise<any> {
    let randomNumber =
      Math.floor(Math.floor(100000 + Math.random() * 900000)) + 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashRandomNumber = bcrypt.hashSync(String(randomNumber), salt);

    let expiryDate = new Date().setMinutes(new Date().getMinutes() + 2);

    let newOTP = {
      type: type,
      mobile: mobile,
      sentCode: hashRandomNumber,
      issueDate: new Date(),
      expiryDate: expiryDate,
      insertedBy: null,
      insertDate: new Date(),
    };

    this.otp = await this.repository.insertOTP(newOTP);

    if (this.otp) {
      return this.smsService.sendSMS(mobile, randomNumber);
    } else {
      throw new GeneralException(
        410,
        'An error occurred while sending the otp code. Please try again later.',
      );
    }
  }

  async renewOTP(otp): Promise<any> {
    this.result = null;

    let randomNumber =
      Math.floor(Math.floor(100000 + Math.random() * 900000)) + 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedRandomNumber = bcrypt.hashSync(String(randomNumber), salt);

    let expiryDate = new Date().setMinutes(new Date().getMinutes() + 2);

    otp.sentCode = hashedRandomNumber;
    otp.expiryDate = expiryDate;
    otp.updateDate = new Date();

    this.result = await this.repository.editOTP(otp._id, otp);

    if (this.result) {
      this.smsService.sendSMS(otp.mobile, randomNumber);
    }

    return this.result;
  }

  async findOTPByEmail(email, otpType) {
    return await this.repository.findOTPByEmail(email, otpType);
  }

  async findOTP(mobile, otpType) {
    return await this.repository.findOTP(mobile, otpType);
  }

  validateOTPExpiryDate(expiryDate) {
    if (new Date(expiryDate).getTime() < new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  }

  async verifyOTP(findOTP, userOTP) {
    let newThis = this;

    try {
      return await bcrypt
        .compare(String(userOTP), findOTP.sentCode)
        .then(async function (result) {
          if (result) {
            try {
              await newThis.repository.deleteOTP(findOTP._id);
            } catch (error) {
              console.log('Error Catched:', error);
            }
            return true;
            /* if (newThis.validateOTPExpiryDate(findOTP.expiryDate)) {
            return true
          } else {
            return false;
          } */
          } else {
            console.log('inValid code');
            return false;
          }
        });
    } catch (error) {
      return false;
    }
  }

  async setVerificationStatus(otpId, verificationStatus, verificationReason) {
    return await this.repository.editOTP(otpId, {
      verificationStatus: verificationStatus,
      verificationStatusChangeReason: verificationReason,
      verificationStatusChangeDate: new Date(),
    });
  }
}
