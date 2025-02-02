import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { OTPTypeEnum } from 'src/modules/utility/enums/otp-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { OTPService } from 'src/modules/utility/services/otp.service';
import { RolesEnum } from '../../enums/roles.enum';
import { UserActivationStatusEnum } from '../../enums/user-activation-status.enum';
import { UserRoleRepository } from '../../repositories/user-role.repository';
import { UserRepository } from '../../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserVerificationStatusEnum } from '../../enums/user-verification-status.enum';
import { UserRoleService } from '../user-role/user-role.service';
import { MediaService } from 'src/modules/utility/services/media.service';
import { JwtService } from '@nestjs/jwt';
import { requestActivationCodeRepeatedlyException } from './../../exception/request-activation-code-repeatedly.exception';
import { UserInfoRepository } from './../../repositories/user-info.repository';
import { verify } from 'jsonwebtoken';
import { VerificationStatusEnum } from 'src/modules/utility/enums/verification-status.enum';
import { ActivationStatusEnum } from 'src/modules/utility/enums/activation-status.enum';
import { CustomerService } from 'src/modules/panel/services/customer.service';
import { UserActivationStatusChangeReasonsEnum } from '../../enums/user-activation-status-change-reasons.enum';
import { UserVerificationStatusChangeReasonsEnum } from '../../enums/user-verification-status-change-reasons.enum';
import { VerificationStatusChangeReasonsEnum } from 'src/modules/utility/enums/verification-status-change-reasons.enum';
import { ServiceService } from 'src/modules/service/services/service.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { DeviceLogService } from 'src/modules/device/services/device-log.service';
import { userSchema } from '../../schemas/user.schema';
import { checkPasswordDto } from '../../data-transfer-objects/user/credential.dto';
import { BuildingService } from 'src/modules/building/buildings/building.service';
import {
  UserChangeEmailTokenInterface,
  UserInterface,
} from '../../interfaces/user.interface';
import { MailService } from 'src/modules/utility/services/mail.service';
import { randomBytes } from 'crypto';

const saltRounds = 10;

/**
 * User manipulation service.
 */

export type User = any;

function generatePassword(length: number): string {
  if (length < 1) {
    throw new Error('Length must be greater than 0');
  }

  const buffer = randomBytes(length);
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += characters.charAt(buffer[i] % characters.length);
  }

  return password;
}

@Injectable()
export class UserService {
  private result;
  private user;
  private userInfo;
  private otp = [];

  constructor(
    private readonly otpService?: OTPService,
    private readonly userRepository?: UserRepository,
    private readonly userInfoRepository?: UserInfoRepository,
    private readonly userRoleService?: UserRoleService,
    private readonly userRoleRepository?: UserRoleRepository,
    private jwtService?: JwtService,
    private readonly mediaService?: MediaService,
    private readonly mailService?: MailService,
    private readonly deviceService?: DeviceService,
    private readonly deviceLogService?: DeviceLogService,
    private readonly serviceService?: ServiceService,
    private readonly installedServiceService?: InstalledServiceService,
    private readonly buildingService?: BuildingService,
  ) {}

  getUserKeys(): string {
    return Object.keys(userSchema.paths).join(' ');
  }

  validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() && emailRegex.test(email.trim());
  }

  generateEmailToken(): string {
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  async generateAndSaveChangeEmailToken(data) {
    console.log('data.newEmail:', String(data.newEmail));

    await this.findAUserByEmail(data.nowEmail);

    if (this.user.google == true) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        `You can't change the email of an google account.`,
      );
    }

    const isEmailVerified: boolean = await this.checkUserEmailVerified(
      data.nowEmail,
    );

    if (isEmailVerified == false) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'First you have to verify your current email.',
      );
    }

    if (this.validateEmail(String(data.newEmail)) == false) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Email is invalid.',
      );
    }

    try {
      const isExist = await this.checkUserEmailIsExist(data.newEmail);

      if (isExist == true) {
        throw new GeneralException(
          ErrorTypeEnum.CONFLICT,
          'User with this email already exist.',
        );
      }
    } catch (error) {}

    const requestedBefore = await this.userRepository.getChangeEmailWithUserId(
      data.userId,
    );

    if (requestedBefore) {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'You have already requested a change email code. Please wait until the current token expires before requesting a new one.',
      );
    }

    const token = this.generateEmailToken();

    const expireDate = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes later

    await this.userRepository.insertChangeEmailToken({
      userId: data.userId,
      newEmail: data.newEmail,
      token: token,
      expireDate: expireDate,
    });

    await this.mailService.sendChangeEmailToken(
      {
        email: data.newEmail,
        name: '',
      },
      token,
    );

    return true;
  }

  async verifyChangeEmailWithToken(token: string) {
    try {
      this.result = await this.userRepository.getChangeEmailWithToken(token);
      console.log(this.result);
    } catch (error) {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'Token is invalid or expired.',
      );
    }

    if (this.result) {
      try {
        const userExist = await this.checkUserEmailIsExist(
          this.result.newEmail,
        );
        if (userExist) {
          throw new GeneralException(
            ErrorTypeEnum.CONFLICT,
            'User with this email already exist.',
          );
        }
      } catch (error) {}

      await this.userRepository.changeUserEmail(
        this.result.userId,
        this.result.newEmail,
      );
      await this.userRepository.deleteChangeEmailToken(token);

      await this.setActivationStatus(
        this.result.userId,
        UserActivationStatusEnum.ACTIVE,
        UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL,
        this.result.userId,
      );
      await this.setVerificationStatus(
        this.result.userId,
        UserVerificationStatusEnum.VERIFIED,
        UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
        this.result.userId,
      );

      return true;
    } else {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'Token is invalid or expired.',
      );
    }
  }

  async sendOTPCodeForSignupByEmail(body) {
    console.log('We are in sendOTPCodeForSignupByEmail service');

    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.REGISTRATION,
    );

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      /* const StorX = await storxController.createUserAndGenerateStorXKey(
        body.email,
        'fides user',
      ); */
      this.otpService.insertEmailOTP(OTPTypeEnum.REGISTRATION, body.email);
      const newUser = await this.insertAUserByEmail({ ...body, StorX: {} });
      const payload = { mobile: newUser.mobile, sub: newUser._id };

      this.buildingService.createDefaultBuilding(newUser._id);

      const accessSignOptions: any = {};
      accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
      accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
      //   accessSignOptions.aّlgorithm = process.env.ACCESS_TOKEN_ALGORITHM;

      const refreshSignOptions: any = {};
      refreshSignOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
      refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;
      //   refreshSignOptions.algorithm = process.env.REFRESH_TOKEN_ALGORITHM;
      const accessToken = this.jwtService.sign(payload, {
        ...accessSignOptions,
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      const refreshToken = this.jwtService.sign(payload, {
        ...refreshSignOptions,
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      const tokens = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return { ...newUser.toObject(), tokens };
    } else {
      throw new requestActivationCodeRepeatedlyException(
        (new Date(this.otp[this.otp.length - 1].expiryDate).getTime() -
          new Date().getTime()) /
          1000,
      );
    }
  }

  async sendOTPCodeForVrifyEmail(userEmail: string) {
    console.log('We are in sendOTPCodeForVrifyEmail service ');

    await this.findAUserByEmail(userEmail);

    if (!this.user) {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }

    if (this.user.google == true) {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        `You can't verify google account.`,
      );
    }

    this.otp = await this.otpService.findOTPByEmail(
      userEmail,
      OTPTypeEnum.Verify,
    );

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      await this.otpService.insertEmailOTP(OTPTypeEnum.Verify, userEmail);
    } else {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'Verification email is already sended !',
      );
    }
  }

  async sendOTPCodeForResetPasswordByEmail(body) {
    console.log('We are in sendOTPCodeForResetPasswordByEmail service ');

    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      await this.otpService.insertEmailOTP(
        OTPTypeEnum.CHANGE_PASSWORD,
        body.email,
      );
      return true;
    } else {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'Email already sent.',
      );
    }
  }

  async verifyOtpCodeSentByEmailForSignup(body) {
    console.log('I am in verifyOtpCodeSentByEmailForSignup service!');

    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.REGISTRATION,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      body.otp,
    );

    if (verifyOTP) {
      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      await this.findAUserByEmail(body.email);

      console.log('this.user: ', this.user);

      if (this.user) {
        // User already exists.

        await this.setActivationStatus(
          this.user._id,
          UserActivationStatusEnum.ACTIVE,
          UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL,
          this.user._id,
        );
        await this.setVerificationStatus(
          this.user._id,
          UserVerificationStatusEnum.VERIFIED,
          UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
          this.user._id,
        );

        const response: any = await this.myProfileResponse(this.user);
        response.tokens = this.generateTokensByEmail(
          this.user.email,
          this.user._id,
        );

        return true;
      } else {
        // User does not exists.

        const roles: any[] = [];
        const ordinaryUserRole = await this.userRoleRepository.findARoleByName(
          RolesEnum.ORDINARY,
        );

        if (ordinaryUserRole) {
          roles.push(ordinaryUserRole);
        }

        const newUser = {
          email: body.email,
          roles: roles,
          insertDate: new Date(),
          updateDate: new Date(),
        };

        const insertedUser = await this.userRepository.insertUser(newUser);

        const whereCondition = { isDeleted: false };
        const populateCondition = [];
        const selectCondition = this.getUserKeys();

        const foundedNewUser = await this.userRepository.findUserById(
          insertedUser._id,
          whereCondition,
          populateCondition,
          selectCondition,
        );

        const response: any = await this.myProfileResponse(foundedNewUser);
        response.tokens = this.generateTokensByEmail(
          foundedNewUser.email,
          foundedNewUser._id,
        );

        // return await response
        return true;
      }

      // return console.log('Correct code');
    } else {
      // return console.log('expired code');
      return false;
    }
  }

  async verifyOtpCodeSentByEmailForVerify(body) {
    console.log('I am in verifyOtpCodeSentByEmailForVerify service!');

    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.Verify,
    );

    console.log('after findOTPByEmail', this.otp);

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      body.otp,
    );

    if (!this.otp || verifyOTP == false) {
      return false;
    }

    if (verifyOTP) {
      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      await this.findAUserByEmail(body.email);

      console.log('this.user: ', this.user);

      if (this.user) {
        // User already exists.

        await this.setActivationStatus(
          this.user._id,
          UserActivationStatusEnum.ACTIVE,
          UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL,
          this.user._id,
        );
        await this.setVerificationStatus(
          this.user._id,
          UserVerificationStatusEnum.VERIFIED,
          UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
          this.user._id,
        );

        const response: any = await this.myProfileResponse(this.user);
        response.tokens = this.generateTokensByEmail(
          this.user.email,
          this.user._id,
        );

        return true;
      }

      // return console.log('Correct code');
    } else {
      // return console.log('expired code');
      console.log('Returning False');

      return false;
    }
  }

  async verifyOtpCodeSentByEmailForResetPassword(body) {
    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      body.otp,
    );

    if (!this.otp || verifyOTP == false) {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'Otp is not valid');
    }

    const otp = await this.otpService.insertOTPCode(
      OTPTypeEnum.RESET_PASSWORD,
      body.email,
    );

    return otp;
  }

  async changePasswordAndActivateAccount(data) {
    await this.findAUserByEmail(data.email);

    // Check if user found
    if (this.user) {
      // User found.

      console.log('User found for password change.');
      console.log('New Password: ', data.newPassword);

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedNewPassword = bcrypt.hashSync(String(data.newPassword), salt);

      this.user.password = hashedNewPassword;
      this.user.activationStatus = ActivationStatusEnum.ACTIVE;
      this.user.activationStatusChangeDate = new Date();
      this.user.updateDate = new Date();

      await this.userRepository.editUser(this.user._id, this.user);
      return await this.findAUserById(this.user._id);
    } else {
      // User found.

      console.log('User not found for password change.');

      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async sendOTPCode(mobile) {
    this.otp = await this.otpService.findOTP(mobile, OTPTypeEnum.REGISTRATION);

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      return this.otpService.insertOTP(OTPTypeEnum.REGISTRATION, mobile);
    } else {
      throw new requestActivationCodeRepeatedlyException(
        (new Date(this.otp[this.otp.length - 1].expiryDate).getTime() -
          new Date().getTime()) /
          1000,
      );
    }
  }

  async verifyOtpCode(body) {
    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.RESET_PASSWORD,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      body.otp,
    );

    return verifyOTP as boolean;
  }

  async sendOTPForChangePassword(email) {
    this.user = await this.findAUserByEmail(email);

    this.otp = await this.otpService.findOTP(
      email,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    if (!this.user) {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      return this.otpService.insertEmailOTP(OTPTypeEnum.CHANGE_PASSWORD, email);
    } else {
      throw new requestActivationCodeRepeatedlyException(
        (new Date(this.otp[this.otp.length - 1].expiryDate).getTime() -
          new Date().getTime()) /
          1000,
      );
    }
  }

  async checkUserEmailIsExist(userEmail): Promise<boolean> {
    console.log('I am in checkUserEmailIsExist!');

    await this.findAUserByEmail(userEmail);

    if (this.user) {
      console.log('User found!');
      return true;
    } else {
      console.log('User not found!');
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'User does not exist.',
      );
      // return false
    }
  }

  async otpVerificationAndChangePassword(data) {
    this.otp = await this.otpService.findOTP(
      data.email,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      data.otp,
    );

    if (verifyOTP) {
      await this.findAUserByEmail(data.email);

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedNewPassword = bcrypt.hashSync(String(data.newPassword), salt);

      this.user.password = hashedNewPassword;
      this.user.updateDate = new Date();

      await this.userRepository.editUser(this.user._id, this.user);
      return await this.findAUserById(this.user._id);
    } else {
      return console.log('expired code');
    }
  }

  async findAUserByEmail(email) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return (this.user = await this.userRepository.findUserByEmail(
      email,
      whereCondition,
      populateCondition,
      selectCondition,
    ));
  }

  async checkUserEmailVerified(email: string): Promise<boolean> {
    return (
      (this.user = await this.userRepository.checkUserEmailVerified(email)) ??
      false
    );
  }

  async findAUserByMobile(
    mobile,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return (this.user = await this.userRepository.findUserByMobile(
      mobile,
      whereCondition,
      populateCondition,
      selectCondition,
    ));
  }

  async makeUserAdmin(userEmail: string, roleNames: Array<string>) {
    let newRoles = [];

    for (const theRole of roleNames) {
      const adminRolePermissions = await this.userRoleService
        .findARoleByShortName(theRole)
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding user permission!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
      if (!adminRolePermissions) {
        let errorMessage =
          'Some errors occurred while finding user permission!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      }
      newRoles.push(adminRolePermissions._id.toString());
    }

    let userRes = (await this.findAUserByEmail(userEmail)) as any;

    if (!userRes) {
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'Account not found for making admin!',
      );
    }

    await this.userRepository.editUser(userRes._id, {
      roles: [
        ...userRes.roles.filter(
          (role: any) => !newRoles.includes(role._id.toString()),
        ),
        ...newRoles,
      ],
    });

    return {
      success: true,
      message: 'User turned into admin successfully.',
      date: new Date(),
    };
  }

  async takeUserAdminRanks(userEmail: string, roleNames: Array<string>) {
    const userRes = await this.findAUserByEmail(userEmail);

    if (!userRes) {
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'Account not found for taking admin ranks!',
      );
    }

    const hasToRemoveRoles = this.userRoleService.defaultRoles
      .map((roles) => {
        if (roleNames.includes(roles.short)) {
          return roles.roleName;
        }
      })
      .filter((roleName) => roleName !== undefined);

    const existRolesIds = userRes.roles
      .filter((role: any) => !hasToRemoveRoles.includes(role.name))
      .map((roles: any) => roles._id);

    await this.userRepository.editUser(userRes._id, {
      roles: [...existRolesIds],
    });
    return {
      success: true,
      message: 'User admin ranks revoked.',
      date: new Date(),
    };
  }

  async editUserByUser(userId, data) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    this.user = await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      data.updatedBy = userId;
      data.updateDate = new Date();
      console.log('Edited Data:', data);

      await this.userRepository.editUser(userId, data);
      return await this.findAUserById(userId);
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async changeMyProfileActivation(userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    this.user = await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      if (this.user.activationStatus == UserActivationStatusEnum.ACTIVE) {
        this.user.activationStatus = UserActivationStatusEnum.INACTIVE;
        this.user.updatedBy = this.user._id;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      }
      if (this.user.activationStatus == UserActivationStatusEnum.INACTIVE) {
        this.user.activationStatus = UserActivationStatusEnum.ACTIVE;
        this.user.updatedBy = this.user._id;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async changeUserProfileActivationByPanel(user, userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    this.user = await this.userRepository.findUserById(
      user,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      if (this.user.activationStatus == UserActivationStatusEnum.ACTIVE) {
        this.user.activationStatus = UserActivationStatusEnum.INACTIVE;
        this.user.updatedBy = userId;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(user, this.user);
        return await this.findAUserById(user);
      }
      if (this.user.activationStatus == UserActivationStatusEnum.INACTIVE) {
        this.user.activationStatus = UserActivationStatusEnum.ACTIVE;
        this.user.updatedBy = userId;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(user, this.user);
        return await this.findAUserById(user);
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async changeUserProfileVerificationByPanel(user, userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    this.user = await this.userRepository.findUserById(
      user,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      if (this.user.activationStatus == UserVerificationStatusEnum.VERIFIED) {
        this.user.activationStatus = UserVerificationStatusEnum.UNVERIFIED;
        this.user.updatedBy = userId;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(user, this.user);
        return await this.findAUserById(user);
      }
      if (this.user.activationStatus == UserVerificationStatusEnum.UNVERIFIED) {
        this.user.activationStatus = UserVerificationStatusEnum.VERIFIED;
        this.user.updatedBy = userId;
        this.user.updateDate = new Date();

        await this.userRepository.editUser(user, this.user);
        return await this.findAUserById(user);
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async generateTokensByEmail(email, userId) {
    const payload = { email: email, sub: userId };

    const accessSignOptions: any = {};
    accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
    accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
    accessSignOptions.algorithm = process.env.ACCESS_TOKEN_ALGORITHM;

    const refreshSignOptions: any = {};
    refreshSignOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
    refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;
    refreshSignOptions.algorithm = process.env.REFRESH_TOKEN_ALGORITHM;

    const accessToken = this.jwtService.sign(payload, {
      ...accessSignOptions,
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    });
    const refreshToken = this.jwtService.sign(payload, {
      ...refreshSignOptions,
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
    });

    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return tokens;
  }

  async changeActivationStatusOfUser(userId, data): Promise<any> {
    let foundUser = null;
    await this.findAUserById(data._id)
      .then((data) => {
        foundUser = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundUser.activationStatus = data.activationStatus;
    foundUser.activationStatusChangeReason =
      UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL;
    foundUser.activationStatusChangedBy = userId;
    foundUser.activationStatusChangeDate = new Date();
    foundUser.updatedBy = userId;
    foundUser.updateDate = new Date();

    await this.userRepository
      .editUser(data._id, foundUser)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while editing a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async changeVerificationStatusOfUser(userId, data): Promise<any> {
    let foundUser = null;
    await this.findAUserById(data._id)
      .then((data) => {
        foundUser = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundUser.verificationStatus = data.verificationStatus;
    foundUser.verificationStatusMessage = data.verificationStatusMessage;
    foundUser.verificationStatusChangeReason =
      UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL;
    foundUser.verificationStatusChangedBy = userId;
    foundUser.verificationStatusChangeDate = new Date();
    foundUser.updatedBy = userId;
    foundUser.updateDate = new Date();

    await this.userRepository
      .editUser(data._id, foundUser)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while editing a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getUserByEmail(userEmail): Promise<UserInterface> {
    const whereCondition = {};
    const populateCondition = [];
    const selectCondition = this.getUserKeys();

    console.log('we are in getUserByEmail service!');

    await this.userRepository
      .findUserByEmail(
        userEmail,
        whereCondition,
        populateCondition,
        selectCondition,
      )
      .then((data) => {
        this.result = data;
        console.log('Found user is: ', this.result);
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while finfing a user by email!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteUser(data, userId): Promise<any> {
    // let foundUser = null;
    // await this.userRepository.findUserById(data._id)
    // .then((data)=>{
    //     foundUser = data
    // })
    // .catch((error)=>{
    //     let errorMessage = 'Some errors occurred while finding a user!';
    //     throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage)
    // })
    // if(foundUser && foundUser !== undefined && foundUser.deletable){
    //     foundUser.isDeleted = data.isDeleted;
    //     foundUser.deletionReason = data.deletionReason;
    //     foundUser.deletedBy = userId;
    //     foundUser.deleteDate = new Date();
    // }
    // await this.userRepository.editUser(data._id, foundUser)
    // .then((data)=>{
    //     this.result = data
    // })
    // .catch((error)=>{
    //     let errorMessage = 'Some errors occurred while editing a user!';
    //     throw new GeneralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
    // })
    // return this.result;
  }

  async findAUserById(userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'name module label description routes',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async getUserProfileByIdFromUser(userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async getUserProfileByUserEmail(userEmail: string) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return await this.userRepository.findUserByEmail(
      userEmail,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async getUserFirebaseTokenById(userId) {
    const whereCondition = {
      isDeleted: false,
      // activationStatus: UserActivationStatusEnum.ACTIVE,
      // verificationStatus: UserVerificationStatusEnum.VERIFIED,
    };
    const selectCondition = 'firebaseToken';

    return await this.userRepository.findUserById(
      userId,
      whereCondition,
      [],
      selectCondition,
    );
  }

  async getUserProfileByIdFromPanel(userId) {
    const whereCondition = {};
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async searchUsers(
    pageNumber,
    limit,
    sortMode,
    searchText,
    activationStatus,
    verificationStatus,
    isDeleted,
    fromDate,
    toDate,
    userId,
  ) {
    let finalQuery = null;
    const $and: any = [];

    /* let fromDateISO: any;
        let toDateISO: any; */

    if (sortMode === 'ASCENDING' || sortMode === 'ascending') {
      sortMode = 'ASC';
    } else if (sortMode === 'DESCENDING' || sortMode === 'descending') {
      sortMode = 'DESC';
    }

    /* if (firstName !== null && firstName !== "" && firstName !== undefined )
            $and.push({ firstName: new RegExp(firstName, "i") });    // i stands for case insensitive.  Also you can use $and.push({ firstName: { $regex: firstName, $options: 'i' } }); 
         */

    /* fromDateISO = new Date(fromDate).toISOString();
        toDateISO = new Date(toDate).toISOString();
        fromDate = new Date(fromDate).toString();
        toDate = new Date(toDate).toString(); */

    /* fromDateISO = new Date(fromDate).toISOString();
        toDateISO = new Date(toDate).toISOString();

        $and.push({ 
            insertDate: {
                $gte: fromDateISO,
                $lte: toDateISO
            }
        }); */

    if (
      fromDate !== null &&
      fromDate !== '' &&
      fromDate !== undefined &&
      toDate !== null &&
      toDate !== '' &&
      toDate !== undefined
    ) {
      $and.push({
        insertDate: {
          $gte: fromDate,
          $lte: toDate,
        },
      });
    }
    if (
      activationStatus !== null &&
      activationStatus !== '' &&
      activationStatus !== undefined
    ) {
      $and.push({ activationStatus: activationStatus });
    }
    if (
      verificationStatus !== null &&
      verificationStatus !== '' &&
      verificationStatus !== undefined
    ) {
      $and.push({ verificationStatus: verificationStatus });
    }
    /* if(isDeleted === "FALSE" || isDeleted === "false"){
            $and.push({ isDeleted: false });
        } else if(isDeleted === "TRUE" || isDeleted === "true"){
            $and.push({ isDeleted: true });
        } */

    $and.push({ isDeleted: false });

    if (searchText === '') {
      finalQuery = {
        $and,
      };
    } else {
      finalQuery = {
        $and,
        $or: [
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastNname: { $regex: searchText, $options: 'i' } },
          { mobile: { $regex: searchText, $options: 'i' } },
          {
            activationStatusChangeReason: { $regex: searchText, $options: 'i' },
          },
          {
            verificationStatusChangeReason: {
              $regex: searchText,
              $options: 'i',
            },
          },
          { deletionReason: { $regex: searchText, $options: 'i' } },
        ],
      };
    }

    const options = {
      page: pageNumber,
      sort: { insertDate: sortMode },
      populate: [
        {
          path: 'insertedBy',
          select: '_id email mobile firstName lastName',
        },
        {
          path: 'updatedBy',
          select: '_id email mobile firstName lastName',
        },
        {
          path: 'deletedBy',
          select: '_id email mobile firstName lastName',
        },
      ],
      limit: limit,
    };
    await this.userRepository
      .searchUsers(finalQuery, options)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });
    return this.result;
  }

  async checkUserPasswords(data: checkPasswordDto) {
    const isValidPassword = await this.validateUserPassword(
      data.enteredPassword,
      data.userPassword,
    );
    return isValidPassword;
  }

  async credential(data, createIfNotExist = false) {
    console.log('We are in credential');

    this.user = null;

    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'name module label description routes',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    this.user = await this.userRepository.findUserByEmail(
      data.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (createIfNotExist == true && !this.user) {
      console.log('Creating User');
      this.user = await this.insertAUserByEmail({
        ...data,
        google: true,
        email: data.email,
        password: generatePassword(16),
        StorX: {},
      });

      await this.setActivationStatus(
        this.user._id,
        UserActivationStatusEnum.ACTIVE,
        UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL,
        this.user._id,
      );
      await this.setVerificationStatus(
        this.user._id,
        UserVerificationStatusEnum.VERIFIED,
        UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
        this.user._id,
      );
    }

    if (this.user) {
      let isValidPassword;

      if (createIfNotExist == true) {
        if (!this.user.google || this.user.google == false) {
          throw new GeneralException(
            ErrorTypeEnum.FORBIDDEN,
            'This email already have an account ( try login via email and password )',
          );
        }
        isValidPassword = true;
      } else {
        isValidPassword = await this.validateUserPassword(
          data.password,
          this.user.password,
        );
      }

      console.log('Is Valid Password:', isValidPassword.toString());

      if (isValidPassword) {
        const payload = { email: this.user.email, sub: this.user._id };

        const accessSignOptions: any = {};
        accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
        accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
        accessSignOptions.algorithm = process.env.ACCESS_TOKEN_ALGORITHM;

        const refreshSignOptions: any = {};
        refreshSignOptions.expiresIn =
          process.env.REFRESH_TOKEN_EXPIRATION_TIME;
        refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;
        refreshSignOptions.algorithm = process.env.REFRESH_TOKEN_ALGORITHM;

        const accessToken = this.jwtService.sign(payload, {
          ...accessSignOptions,
          secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        });
        const refreshToken = this.jwtService.sign(payload, {
          ...refreshSignOptions,
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        });

        const tokens = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        const response: any = await this.myProfileResponse(this.user);
        response.tokens = tokens;

        return response;
      } else {
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async adminCredential(data, isGoogle = false) {
    console.log('We are in adminCredential');

    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'name module label description routes',
        },
      },
    ];

    const selectCondition = this.getUserKeys();

    this.user = await this.userRepository.findUserByEmail(
      data.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      if (
        !this.user ||
        !this.user.roles ||
        this.user.roles.some((role) => role.department === 'admins') == false
      ) {
        throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied.');
      }

      let isValidPassword;

      if (isGoogle == true) {
        if (!this.user.google || this.user.google == false) {
          throw new GeneralException(
            ErrorTypeEnum.FORBIDDEN,
            'This email already have an account ( try login via email and password )',
          );
        }
        isValidPassword = true;
      } else {
        isValidPassword = await this.validateUserPassword(
          data.password,
          this.user.password,
        );
      }


      if (isValidPassword) {
        const payload = { email: this.user.email, sub: this.user._id };

        const accessSignOptions: any = {};
        accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
        accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
        accessSignOptions.algorithm = process.env.ACCESS_TOKEN_ALGORITHM;

        const refreshSignOptions: any = {};
        refreshSignOptions.expiresIn =
          process.env.REFRESH_TOKEN_EXPIRATION_TIME;
        refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;
        refreshSignOptions.algorithm = process.env.REFRESH_TOKEN_ALGORITHM;

        const accessToken = this.jwtService.sign(payload, {
          ...accessSignOptions,
          secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        });
        const refreshToken = this.jwtService.sign(payload, {
          ...refreshSignOptions,
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        });

        const tokens = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        const response: any = await this.myProfileResponse(this.user);
        response.tokens = tokens;

        return await response;
      } else {
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async getUserShortRolesByUserEmail(userEmail: string) {
    const userRes = await this.findAUserByEmail(userEmail);
    if (!userRes) {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'Account not found!');
    }

    const shortRoles = userRes.roles.flatMap((userRole: any) => {
      return this.userRoleService.defaultRoles
        .filter((sysRole) => sysRole.roleName === userRole.name)
        .map((sysRole) => sysRole.short);
    });

    return shortRoles;
  }

  async validateUserPassword(enteredPassword, userPassword) {
    let isValidPassword = null;

    await bcrypt.compare(enteredPassword, userPassword).then((result) => {
      if (result == true) {
        isValidPassword = true;
      } else {
        isValidPassword = false;
      }
    });

    return isValidPassword;
  }

  async refreshTokens(data) {
    let verifiedRefreshToken = null;
    let verifiedOldAccessToken = null;

    console.log('Date.now(): ' + Math.floor(Date.now() / 1000));

    await verify(
      data.refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (error, decodedToken) => {
        var util = require('util');
        console.log(
          'decoded refresh Token: ' +
            util.inspect(decodedToken, {
              showHidden: false,
              depth: null,
              colors: true,
            }),
        );

        if (error) {
          throw new GeneralException(
            418,
            'Entered refresh token is invalid and we cant verify it. ' + error,
          );
        } else {
          if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
            // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            throw new GeneralException(
              418,
              'Entered refresh token is expired please get new token.',
            );
          } else {
            verifiedRefreshToken = decodedToken;
          }
        }
      },
    );

    await verify(
      data.oldAccessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      (error, decodedToken) => {
        var util = require('util');
        console.log(
          'decoded access Token: ' +
            util.inspect(decodedToken, {
              showHidden: false,
              depth: null,
              colors: true,
            }),
        );

        if (error) {
          throw new GeneralException(
            418,
            'Entered access token is invalid and we cant verify it. ' + error,
          );
        } else {
          if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
            // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            throw new GeneralException(
              418,
              'Entered access token is expired please get new token.',
            );
          } else {
            verifiedOldAccessToken = decodedToken;
          }
        }
      },
    );

    if (verifiedOldAccessToken.sub === verifiedRefreshToken.sub) {
      const payload = {
        email: verifiedOldAccessToken.email,
        sub: verifiedOldAccessToken.sub,
      };

      const accessSignOptions: any = {};
      accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
      accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
      accessSignOptions.algorithm = process.env.ACCESS_TOKEN_ALGORITHM;

      const refreshSignOptions: any = {};
      refreshSignOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
      refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;
      refreshSignOptions.algorithm = process.env.REFRESH_TOKEN_ALGORITHM;

      const accessToken = this.jwtService.sign(payload, {
        ...accessSignOptions,
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });
      const refreshToken = this.jwtService.sign(payload, {
        ...refreshSignOptions,
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      const tokens = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return tokens;
    }
  }

  async userResponse(data) {
    return {
      _id: data._id,
      firstName: data.firstName ? data.firstName : '',
      lastName: data.lastName ? data.lastName : '',
      email: data.email ? data.email : '',
      mobile: data.mobile ? data.mobile : '',
      roles: data.roles ? data.roles : [],
      info: data.info ? data.info : {},
      activationStatus: data.activationStatus
        ? data.activationStatus
        : ActivationStatusEnum.INACTIVE,
      verificationStatus: data.verificationStatus
        ? data.verificationStatus
        : VerificationStatusEnum.UNVERIFIED,
      insertDate: data.insertDate ? data.insertDate : '',
      updateDate: data.updateDate ? data.updateDate : '',
    };
  }

  async myProfileResponse(data) {
    return {
      _id: data._id,
      firstName: data.firstName ? data.firstName : '',
      lastName: data.lastName ? data.lastName : '',
      address: data.address ? data.address : '',
      timezone: data.timezone ? data.timezone : '',
      mobile: data.mobile ? data.mobile : '',
      email: data.email ? data.email : '',
      walletAddress: data.walletAddress ? data.walletAddress : '',
      roles: data.roles ? data.roles : [],
      info: data.info ? data.info : {},
      activationStatus: data.activationStatus
        ? data.activationStatus
        : ActivationStatusEnum.INACTIVE,
      activationStatusChangeReason: data.activationStatusChangeReason
        ? data.activationStatusChangeReason
        : '',
      activationStatusChangedBy: data.activationStatusChangedBy
        ? data.activationStatusChangedBy
        : '',
      activationStatusChangeDate: data.activationStatusChangeDate
        ? data.activationStatusChangeDate
        : '',
      verificationStatus: data.verificationStatus
        ? data.verificationStatus
        : VerificationStatusEnum.UNVERIFIED,
      verificationStatusChangeReason: data.verificationStatusChangeReason
        ? data.verificationStatusChangeReason
        : '',
      verificationStatusChangedBy: data.verificationStatusChangedBy
        ? data.verificationStatusChangedBy
        : '',
      verificationStatusChangeDate: data.verificationStatusChangeDate
        ? data.verificationStatusChangeDate
        : '',
      insertedBy: data.insertedBy ? data.insertedBy : '',
      insertDate: data.insertDate ? data.insertDate : '',
      updatedBy: data.updatedBy ? data.updatedBy : '',
      updateDate: data.updateDate ? data.updateDate : '',
      isDeletable: data.isDeletable ? data.isDeletable : true,
      isDeleted: data.isDeleted ? data.isDeleted : false,
      deletedBy: data.deletedBy ? data.deletedBy : '',
      deleteDate: data.deleteDate ? data.deleteDate : '',
      deletionReason: data.deletionReason ? data.deletionReason : '',
    };
  }

  async searchInUsersByPanel(
    pageNumber,
    limit,
    sortMode,
    searchText,
    users,
    activation,
    verification,
    fromDate,
    toDate,
    user,
  ) {
    const $and: any = [];
    $and.push({ isDeleted: false });
    $and.push({
      insertDate: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    if (users && users[0] !== undefined) {
      $and.push({ _id: { $in: users } });
    }
    if (activation != '') {
      $and.push({ isActive: Boolean(activation) });
    }
    if (verification != '') {
      $and.push({ isVerified: Boolean(verification) });
    }

    let finalQuery = null;
    if (searchText === '') {
      finalQuery = {
        $and,
      };
    } else {
      finalQuery = {
        $and,
        $or: [
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastName: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
          { mobile: { $regex: searchText, $options: 'i' } },
        ],
      };
    }

    const options = {
      page: pageNumber,
      sort: { insertDate: sortMode },
      populate: [
        {
          path: 'roles',
          populate: {
            path: 'permissions',
          },
        },
        {
          path: 'insertedBy',
          select: 'firstName lastName email mobile',
        },
        {
          path: 'updatedBy',
          select: 'firstName lastName email mobile',
        },
        {
          path: 'deletedBy',
          select: 'firstName lastName email mobile',
        },
      ],
      limit: limit,
      select:
        'firstName lastName avatar lang title email StorX mobile roles info activationStatus activationStatusChangeReason activationStatusChangedBy activationStatusChangeDate verificationStatus verificationStatusChangeReason verificationStatusChangedBy verificationStatusChangeDate insertedBy insertDate updatedBy updateDate isDeletable isDeleted deletedBy deleteDate deletionReason',
    };

    return await this.userRepository.paginate(finalQuery, options);
  }

  async setActivationStatus(
    userId,
    activationStatus,
    activationReason,
    activationStatusChangedBy,
  ) {
    console.log('We are in setActivationStatus', activationStatusChangedBy);

    return await this.userRepository.editUser(userId, {
      activationStatus: activationStatus,
      activationStatusChangeReason: activationReason,
      activationStatusChangedBy: activationStatusChangedBy,
      activationStatusChangeDate: new Date(),
    });
  }

  async setVerificationStatus(
    userId,
    verificationStatus,
    verificationReason,
    verificationStatusChangedBy,
  ) {
    console.log('We are in setVerificationStatus', verificationStatusChangedBy);

    return await this.userRepository.editUser(userId, {
      verificationStatus: verificationStatus,
      verificationStatusChangeReason: verificationReason,
      verificationStatusChangedBy: verificationStatusChangedBy,
      verificationStatusChangeDate: new Date(),
    });
  }

  async setFirebaseToken(userId: string, token: string) {
    return await this.userRepository.editUser(userId, {
      firebaseToken: token,
    });
  }

  async insertAUserByEmail(body): Promise<UserInterface> {
    const roles: any[] = [];
    const ordinaryUserRole = await this.userRoleRepository.findARoleByName(
      RolesEnum.ORDINARY,
    );

    if (ordinaryUserRole) {
      roles.push(ordinaryUserRole);
    }

    const salt = bcrypt.genSaltSync(saltRounds);

    const newUser = {
      ...body,
      password: bcrypt.hashSync(String(body.password), salt),
      StorX: body.StorX || {},
      roles: roles,
      insertDate: new Date(),
      updateDate: new Date(),
    };

    console.log('newUser:', newUser);

    const insertedUser = await this.userRepository.insertUser(newUser);
    console.log('User inserted!');
    return insertedUser;
  }

  async insertUserByEmail(body) {
    console.log('I am in insertUserByEmail service!');

    await this.findAUserByEmail(body.email);

    console.log('this.user: ', this.user);

    if (this.user) {
      // User already exists.

      return await this.user;
    } else {
      // User does not exists.

      const roles: any[] = [];
      const ordinaryUserRole = await this.userRoleRepository.findARoleByName(
        RolesEnum.ORDINARY,
      );

      if (ordinaryUserRole) {
        roles.push(ordinaryUserRole);
      }

      const salt = bcrypt.genSaltSync(saltRounds);

      const newUser = {
        email: body.email,
        password: bcrypt.hashSync(String(body.password), salt),
        roles: roles,
        insertDate: new Date(),
        updateDate: new Date(),
      };

      const insertedUser = await this.userRepository.insertUser(newUser);

      const whereCondition = { isDeleted: false };
      const populateCondition = [
        {
          path: 'roles',
          populate: {
            path: 'permissions',
            select: 'name module label description routes',
          },
        },
      ];
      const selectCondition = this.getUserKeys();

      const foundedNewUser = await this.userRepository.findUserById(
        insertedUser._id,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      return await foundedNewUser;
    }
  }

  async getAllUsers() {
    const whereCondition = { isDeleted: false };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'name module label description routes',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    let foundUsers: any = null;
    const response = [];

    console.log('we are in getAllUsers service!');

    foundUsers = await this.userRepository.getAllUsers(
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('Found users are: ', foundUsers);

    foundUsers.forEach((element) => {
      response.push({ ...element._doc });
    });
    //console.log('response are: ', response);

    return response;
  }

  async deleteUserPermanently(userId) {
    await this.userRepository
      .deleteUserPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while deleting user in user service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllUserDataPermanently(userId) {
    await this.installedServiceService
      .deleteAllUserInstalledServicesPermanently(userId)
      .then(async (data) => {
        await this.serviceService
          .deleteAllUserServicesPermanently(userId)
          .then(async (data) => {})
          .catch((error) => {
            const errorMessage =
              'Some errors occurred while deleting devices in user service!';
            throw new GeneralException(
              ErrorTypeEnum.UNPROCESSABLE_ENTITY,
              errorMessage,
            );
          });
        await this.deviceService
          .getDevicesByUserId(userId)
          .then(async (data) => {
            const userDevices = data;
            userDevices.forEach(async (element) => {
              await this.deviceLogService
                .deleteAllUserDeviceLogsPermanently(element.deviceEncryptedId)
                .then(async (data) => {})
                .catch((error) => {
                  const errorMessage =
                    'Some errors occurred while deleting all user device logs in user service!';
                  throw new GeneralException(
                    ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                    errorMessage,
                  );
                });
            });

            await this.deviceService
              .deleteAllUserDevicesPermanently(userId)
              .then(async (data) => {
                await this.deleteUserPermanently(userId)
                  .then(async (data) => {
                    this.result = data;
                  })
                  .catch((error) => {
                    const errorMessage =
                      'Some errors occurred while deleting user in user service!';
                    throw new GeneralException(
                      ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                      errorMessage,
                    );
                  });
                this.result = data;
              })
              .catch((error) => {
                const errorMessage =
                  'Some errors occurred while deleting all user devices in user service!';
                throw new GeneralException(
                  ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                  errorMessage,
                );
              });
            this.result = data;
          })
          .catch((error) => {
            const errorMessage =
              'Some errors occurred get user devices for deletion in user service!';
            throw new GeneralException(
              ErrorTypeEnum.UNPROCESSABLE_ENTITY,
              errorMessage,
            );
          });
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while deleting activities in user service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
