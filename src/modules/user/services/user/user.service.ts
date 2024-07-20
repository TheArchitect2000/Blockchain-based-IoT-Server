import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { OTPTypeEnum } from 'src/modules/utility/enums/otp-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
// import { OTPException } from 'src/modules/utility/exceptions/otp.exception';
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
// import { waitingTimeException } from './../../exception/waiting-time.exception';
import { requestActivationCodeRepeatedlyException } from './../../exception/request-activation-code-repeatedly.exception';
import { UserInfoRepository } from './../../repositories/user-info.repository';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { VerificationStatusEnum } from 'src/modules/utility/enums/verification-status.enum';
import { ActivationStatusEnum } from 'src/modules/utility/enums/activation-status.enum';
import { CustomerService } from 'src/modules/panel/services/customer.service';
import { UserActivationStatusChangeReasonsEnum } from '../../enums/user-activation-status-change-reasons.enum';
import { UserVerificationStatusChangeReasonsEnum } from '../../enums/user-verification-status-change-reasons.enum';
import { VerificationStatusChangeReasonsEnum } from 'src/modules/utility/enums/verification-status-change-reasons.enum';
import { CustomerRepository } from 'src/modules/panel/repositories/customer.repository';
import { Media } from 'src/modules/utility/interfaces/media.interface';
import { log } from 'console';
import { ServiceService } from 'src/modules/service/services/service.service';
import { InstalledServiceService } from 'src/modules/service/services/installed-service.service';
import { DeviceService } from 'src/modules/device/services/device.service';
import { DeviceLogService } from 'src/modules/device/services/device-log.service';
import storxController from 'src/modules/device/controllers/storx.controller';
import { userSchema } from '../../schemas/user.schema';
import { checkPasswordDto } from '../../data-transfer-objects/user/credential.dto';
import { VirtualMachineHandlerService } from 'src/modules/virtual-machine/services/service-handler.service';

const saltRounds = 10;

/**
 * User manipulation service.
 */

export type User = any;

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
    private readonly customerService?: CustomerService,
    @Inject(forwardRef(() => DeviceService)) // For avoid circular dependency
    private readonly deviceService?: DeviceService,
    private readonly deviceLogService?: DeviceLogService,
    private readonly serviceService?: ServiceService,
    private readonly installedServiceService?: InstalledServiceService,
  ) {}

  getUserKeys(): string {
    return Object.keys(userSchema.paths).join(' ');
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

  async sendOTPCodeForVrifyEmail(body) {
    console.log('We are in sendOTPCodeForVrifyEmail service ');

    this.otp = await this.otpService.findOTPByEmail(
      body.email,
      OTPTypeEnum.Verify,
    );

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      await this.otpService.insertEmailOTP(OTPTypeEnum.Verify, body.email);
    } else {
      throw new GereralException(
        ErrorTypeEnum.CONFLICT,
        'Verification email is already sended !',
      );
    }

    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';
    await this.findAUserByEmail(
      body.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('this.user', this.user);

    // Check if user found
    if (this.user) {
      return true;
    } else {
      // User not found.

      console.log('User not found for verify email.');

      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
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
    }

    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';
    await this.findAUserByEmail(
      body.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    console.log('this.user', this.user);

    // Check if user found
    if (this.user) {
      // User found.
      console.log('User found for password change.');
      console.log('New Password: ', body.newPassword);

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedNewPassword = bcrypt.hashSync(String(body.newPassword), salt);

      this.user.newPassword = hashedNewPassword;
      this.user.updateDate = new Date();

      await this.userRepository.editUser(this.user._id, this.user);

      // Start of finding a customer in panel...
      /* console.log("Finding a customer in panel...");

            let whereCondition={};
            let populateCondition=[];
            let selectCondition='IsActive Email Username Password NewPassword FirstName LastName Mobile createdAt updatedAt';
            let foundCustomer = null;
            
            foundCustomer = await this.customerService.findACustomerByEmail(body.email, whereCondition, populateCondition, selectCondition);

            if(foundCustomer){
                console.log("Customer found!\n", foundCustomer);

                foundCustomer.NewPassword = await this.customerService.hashPassword(body.newPassword);
                foundCustomer.updatedAt = new Date();

                console.log("Edited Customer found!\n", foundCustomer);
                
                await this.customerService.editCustomer(foundCustomer._id, foundCustomer);

            } else {
                console.log("Customer not found!");
                throw new GereralException(ErrorTypeEnum.NOT_FOUND,'Customer does not exist.');
            } */
      // End of finding a customer in panel.

      return await this.findAUserById(this.user._id);
    } else {
      // User not found.

      console.log('User not found for password change.');

      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
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
      const whereCondition = { isDeleted: false };
      const populateCondition = [];
      const selectCondition = this.getUserKeys();

      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      await this.findAUserByEmail(
        body.email,
        whereCondition,
        populateCondition,
        selectCondition,
      );

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

        // Start of finding a customer in panel...
        /* console.log("Activating a customer in panel...");

                let whereCondition={};
                let populateCondition=[];
                let selectCondition='IsActive Email Username Password FirstName LastName Mobile createdAt updatedAt';
                let foundCustomer = null;
                
                foundCustomer = await this.customerService.findACustomerByEmail(body.email, whereCondition, populateCondition, selectCondition);

                if(foundCustomer){
                    console.log("Customer found!");
                    await this.customerService.changeActivationStatusOfCustomer({_id: foundCustomer._id, isActive: true});
                } else {
                    console.log("Customer not found!");
                    throw new GereralException(ErrorTypeEnum.NOT_FOUND,'Customer does not exist.');
                } */
        // End of finding a customer in panel.

        // return await response

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
          userName: body.email,
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

    if (verifyOTP) {
      const whereCondition = { isDeleted: false };
      const populateCondition = [];
      const selectCondition = this.getUserKeys();

      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      await this.findAUserByEmail(
        body.email,
        whereCondition,
        populateCondition,
        selectCondition,
      );

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

        // Start of finding a customer in panel...
        /* console.log("Activating a customer in panel...");

                let whereCondition={};
                let populateCondition=[];
                let selectCondition='IsActive Email Username Password FirstName LastName Mobile createdAt updatedAt';
                let foundCustomer = null;
                
                foundCustomer = await this.customerService.findACustomerByEmail(body.email, whereCondition, populateCondition, selectCondition);

                if(foundCustomer){
                    console.log("Customer found!");
                    await this.customerService.changeActivationStatusOfCustomer({_id: foundCustomer._id, isActive: true});
                } else {
                    console.log("Customer not found!");
                    throw new GereralException(ErrorTypeEnum.NOT_FOUND,'Customer does not exist.');
                } */
        // End of finding a customer in panel.

        // return await response

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

    if (verifyOTP) {
      const whereCondition = { isDeleted: false };
      const populateCondition = [];
      const selectCondition = this.getUserKeys();

      console.log('I am in verifyOtpCodeSentByEmailForResetPassword service!');

      await this.findAUserByEmail(
        body.email,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      console.log('this.user: ', this.user);

      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      if (this.user) {
        // User found

        this.user.password = this.user.newPassword;
        this.user.activationStatus = ActivationStatusEnum.ACTIVE;
        this.user.activationStatusChangeReason =
          UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_EMAIL;
        this.user.activationStatusChangeDate = new Date();
        this.user.verificationStatus = VerificationStatusEnum.VERIFIED;
        this.user.verificationStatusChangeReason =
          UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL;
        this.user.verificationStatusChangeDate = new Date();
        this.user.updateDate = new Date();

        console.log('this.user: ', this.user);

        await this.userRepository.editUser(this.user._id, this.user);

        // Start of finding a customer in panel...
        /* console.log("Activating a customer in panel...");

                let whereCondition={};
                let populateCondition=[];
                let selectCondition='IsActive Email Username Password NewPassword firstName lastName avatar lang title Mobile createdAt updatedAt';
                let foundCustomer = null;
                
                foundCustomer = await this.customerService.findACustomerByEmail(body.email, whereCondition, populateCondition, selectCondition);

                if(foundCustomer){
                    console.log("Customer found!\n", foundCustomer);
                    foundCustomer.Password = foundCustomer.NewPassword;
                    foundCustomer.updatedAt = new Date();

                    await this.customerService.editCustomer(foundCustomer._id, foundCustomer);
                } else {
                    console.log("Customer not found!");
                    throw new GereralException(ErrorTypeEnum.NOT_FOUND,'Customer does not exist.');
                } */
        // End of finding a customer in panel.

        // return await this.findAUserById(this.user._id);

        return true;
      } else {
        // User not found

        // return console.log('There is not such user!');

        return true;
      }

      // return console.log('Correct code');
    } else {
      // return console.log('expired code');
      return false;
    }
  }

  async changePasswordAndActivateAccount(data) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';
    await this.findAUserByEmail(
      data.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

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

      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
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
    this.otp = await this.otpService.findOTP(
      body.mobile,
      OTPTypeEnum.REGISTRATION,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      body.otp,
    );

    if (verifyOTP) {
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

      await this.findAUserByMobile(
        body.mobile,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      await this.otpService.setVerificationStatus(
        this.otp[this.otp.length - 1]._id,
        VerificationStatusEnum.VERIFIED,
        VerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_EMAIL,
      );

      if (this.user) {
        const payload = { mobile: this.user.mobile, sub: this.user._id };

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
        const roles: any[] = [];
        const ordinaryUserRole = await this.userRoleRepository.findARoleByName(
          RolesEnum.ORDINARY,
        );

        if (ordinaryUserRole) {
          roles.push(ordinaryUserRole);
        }

        const newUser = {
          mobile: body.mobile,
          userName: body.mobile,
          roles: roles,
          insertDate: new Date(),
          updateDate: new Date(),
        };

        const insertedUser = await this.userRepository.insertUser(newUser);

        const whereCondition = { isDeleted: false };
        const populateCondition = [
          {
            path: 'info',
            select:
              'nationalCode nickName fatherName email website telephone fax biography levelOfEducation',
            populate: [
              {
                path: 'profileImage',
              },
              {
                path: 'headerImage',
              },
            ],
          },
          {
            path: 'roles',
            populate: {
              path: 'permissions',
              select: 'name module label description routes',
            },
          },
        ];
        const selectCondition = this.getUserKeys();

        const foundedNewUser = (await this.userRepository.findUserById(
          insertedUser._id,
          whereCondition,
          populateCondition,
          selectCondition,
        )) as any;

        const payload = {
          mobile: foundedNewUser.tel.number || '',
          sub: foundedNewUser._id,
        };

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

        const response: any = await this.myProfileResponse(foundedNewUser);
        response.tokens = tokens;

        return await response;
      }
    } else {
      return console.log('expired code');
    }
  }

  async sendOTPForChangePassword(mobile) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    this.user = await this.findAUserByMobile(
      mobile,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    this.otp = await this.otpService.findOTP(
      mobile,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    if (!this.user) {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }

    if (
      this.otp.length == 0 ||
      new Date(this.otp[this.otp.length - 1].expiryDate).getTime() <
        new Date().getTime()
    ) {
      return this.otpService.insertOTP(OTPTypeEnum.CHANGE_PASSWORD, mobile);
    } else {
      throw new requestActivationCodeRepeatedlyException(
        (new Date(this.otp[this.otp.length - 1].expiryDate).getTime() -
          new Date().getTime()) /
          1000,
      );
    }
  }

  async insertDefaultUsers(): Promise<any> {
    if (!(await this.checkUserNameIsExist('system'))) {
      const roles: string[] = [];
      const fullControllPermission = await this.userRoleService
        .findARoleByName('super_admin')
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding user permission!';
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });

      roles.push(fullControllPermission._id);

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(
        String(process.env.ADMIN_PASSWORD),
        salt,
      );

      const newUser = {
        firstName: 'Main Default',
        lastName: 'System Account',
        userName: 'system',
        mobile: process.env.ADMIN_MOBILE,
        password: hashedPassword,
        roles: roles,
        deletable: false,
        activationStatus: UserActivationStatusEnum.ACTIVE,
        verificationStatus: UserVerificationStatusEnum.VERIFIED,
        insertDate: new Date(),
        updateDate: new Date(),
      };

      await this.userRepository
        .insertUser(newUser)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          const errorMessage =
            'Some errors occurred while inserting a admin user!';
          console.log(error);
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async checkUserNameIsExist(userName) {
    await this.findAUserByUserName(userName);

    if (this.user) {
      return true;
    } else {
      return false;
    }
  }

  async checkUserEmailIsExist(userEmail) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = this.getUserKeys();

    console.log('I am in checkUserEmailIsExist!');

    await this.findAUserByEmail(
      userEmail,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      console.log('User found!');
      return true;
    } else {
      console.log('User not found!');
      throw new GereralException(
        ErrorTypeEnum.NOT_FOUND,
        'User does not exist.',
      );
      // return false
    }
  }

  async otpVerificationAndChangePassword(data) {
    this.otp = await this.otpService.findOTP(
      data.mobile,
      OTPTypeEnum.CHANGE_PASSWORD,
    );

    const verifyOTP = await this.otpService.verifyOTP(
      this.otp[this.otp.length - 1],
      data.otp,
    );

    if (verifyOTP) {
      const whereCondition = { isDeleted: false };
      const populateCondition = [];
      const selectCondition = '';

      await this.findAUserByMobile(
        data.mobile,
        whereCondition,
        populateCondition,
        selectCondition,
      );

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

  async findAUserByEmail(
    email,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return (this.user = await this.userRepository.findUserByEmail(
      email,
      whereCondition,
      populateCondition,
      selectCondition,
    ));
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

  async findAUserByUserName(userName) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    return await this.userRepository.findAUserByUserName(
      userName,
      whereCondition,
      populateCondition,
      selectCondition,
    );
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
      /* if (data.firstName != null || data.firstName != undefined) {
        this.user.firstName = data.firstName;
      }
      if (data.lastName != null || data.lastName != undefined) {
        this.user.lastName = data.lastName;
      }
      if (data.userName != null || data.userName != undefined) {
        this.user.userName = data.userName;
      }
      if (data.mobile != null || data.mobile != undefined) {
        this.user.mobile = data.mobile;
      }
      if (data.walletAddress != null || data.walletAddress != undefined) {
        this.user.walletAddress = data.walletAddress;
      }
      if (data.title != null || data.title != undefined) {
        this.user.title = data.title;
      }
      if (data.avatar != null || data.avatar != undefined) {
        this.user.avatar = data.avatar;
      }
      if (data.lang != null || data.lang != undefined) {
        this.user.lang = data.lang;
      } */

      this.user = data;

      console.log('Edited Data:', this.user);

      setTimeout(() => {}, 5000);

      this.user.updatedBy = this.user._id;
      this.user.updateDate = new Date();

      await this.userRepository.editUser(this.user._id, this.user);
      return await this.findAUserById(this.user._id);
    } else {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  /* async editUserAndInfoByUser(data, userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    const checkUserName = await this.findAUserByUserName(data.userName);
    if (checkUserName != null || checkUserName != undefined) {
      throw new GereralException(
        ErrorTypeEnum.NOT_FOUND,
        'This userName does not exists.',
      );
    }

    let foundedProfileImage;
    if (data.profileImage) {
      foundedProfileImage = await this.mediaService.findById(
        data.profileImage,
        whereCondition,
        populateCondition,
        selectCondition,
      );
      if (!foundedProfileImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'profileImage not uploaded or does not exist.',
        );
      }
    }

    let foundedHeaderImage;
    if (data.headerImage) {
      foundedHeaderImage = await this.mediaService.findById(
        data.headerImage,
        whereCondition,
        populateCondition,
        selectCondition,
      );
      if (!foundedHeaderImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'headerImage not uploaded or does not exist.',
        );
      }
    }

    this.user = await this.userRepository.findUserById(
      userId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      this.user.firstName = data.firstName;
      this.user.lastName = data.lastName;
      this.user.userName = data.userName;
      this.user.updatedBy = this.user._id;
      this.user.updateDate = new Date();

      if (this.user.info == null || this.user.info == undefined) {
        const userInfoData = {
          user: this.user._id,
          nationalCode: data.nationalCode,
          levelOfEducation: data.levelOfEducation,
          nickName: data.nickName,
          fatherName: data.fatherName,
          email: data.email,
          website: data.website,
          telephone: data.telephone,
          fax: data.fax,
          biography: data.biography,
          profileImage: data.profileImage ? foundedProfileImage._id : null,
          headerImage: data.headerImage ? foundedHeaderImage._id : null,
          insertedBy: this.user._id,
          insertDate: new Date(),
          updatedBy: this.user._id,
          updateDate: new Date(),
        };

        this.userInfo = await this.userInfoRepository.create(userInfoData);
        this.user.info = await this.userInfo._id;
        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      } else {
        this.userInfo = await this.userInfoRepository.findAUserInfoByUserId(
          this.user._id,
        );

        this.userInfo.nationalCode = data.nationalCode;
        this.userInfo.levelOfEducation = data.levelOfEducation;
        this.userInfo.nickName = data.nickName;
        this.userInfo.fatherName = data.fatherName;
        this.userInfo.email = data.email;
        this.userInfo.website = data.website;
        this.userInfo.telephone = data.telephone;
        this.userInfo.fax = data.fax;
        this.userInfo.biography = data.biography;
        this.userInfo.profileImage = data.profileImage
          ? foundedProfileImage._id
          : this.userInfo.profileImage;
        this.userInfo.headerImage = data.headerImage
          ? foundedHeaderImage._id
          : this.userInfo.headerImage;
        this.userInfo.updatedBy = this.user._id;
        this.userInfo.updateDate = new Date();

        await this.userInfoRepository.editUserInfo(
          this.userInfo._id,
          this.userInfo,
        );
        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      }
    } else {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  } */

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
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
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
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
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
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async editUserByPanel(data, user, userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    const checkUserName = await this.findAUserByUserName(data.userName);
    if (checkUserName != null || checkUserName != undefined) {
      throw new GereralException(
        ErrorTypeEnum.NOT_FOUND,
        'This userName is exist.',
      );
    }

    const foundedProfileImage = await this.mediaService.findById(
      data.profileImage,
      whereCondition,
      populateCondition,
      selectCondition,
    );
    if (data.profileImage) {
      if (!foundedProfileImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'profileImage not uploaded or does not exist.',
        );
      }
    }

    const foundedHeaderImage = await this.mediaService.findById(
      data.headerImage,
      whereCondition,
      populateCondition,
      selectCondition,
    );
    if (data.headerImage) {
      if (!foundedHeaderImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'headerImage not uploaded or does not exist.',
        );
      }
    }

    this.user = await this.userRepository.findUserById(
      user,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.user) {
      this.user.firstName = data.firstName;
      this.user.lastName = data.lastName;
      this.user.userName = data.userName;
      // this.user.mobile = data.mobile;
      this.user.password = data.password;
      this.user.roles = data.roles;
      this.user.activationStatus = data.activationStatus;
      this.user.verificationStatus = data.verificationStatus;
      this.user.updatedBy = this.user._id;
      this.user.updateDate = new Date();

      if (this.user.info == null || this.user.info == undefined) {
        const userInfoData = {
          user: this.user._id,
          nationalCode: data.nationalCode,
          levelOfEducation: data.levelOfEducation,
          nickName: data.nickName,
          fatherName: data.fatherName,
          email: data.email,
          website: data.website,
          telephone: data.telephone,
          fax: data.fax,
          biography: data.biography,
          profileImage: foundedProfileImage._id,
          headerImage: foundedHeaderImage._id,
          insertedBy: this.user._id,
          insertDate: new Date(),
          updatedBy: this.user._id,
          updateDate: new Date(),
        };

        this.userInfo = await this.userInfoRepository.create(userInfoData);
        this.user.info = await this.userInfo._id;
        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      } else {
        this.userInfo = await this.userInfoRepository.findAUserInfoByUserId(
          this.user._id,
        );

        this.userInfo.nationalCode = data.nationalCode;
        this.userInfo.levelOfEducation = data.levelOfEducation;
        this.userInfo.nickName = data.nickName;
        this.userInfo.fatherName = data.fatherName;
        this.userInfo.email = data.email;
        this.userInfo.website = data.website;
        this.userInfo.telephone = data.telephone;
        this.userInfo.fax = data.fax;
        this.userInfo.biography = data.biography;
        this.userInfo.profileImage = foundedProfileImage._id;
        this.userInfo.headerImage = foundedHeaderImage._id;
        this.userInfo.updatedBy = this.user._id;
        this.userInfo.updateDate = new Date();

        await this.userInfoRepository.editUserInfo(
          this.userInfo._id,
          this.userInfo,
        );
        await this.userRepository.editUser(this.user._id, this.user);
        return await this.findAUserById(this.user._id);
      }
    } else {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async insertUserByPanel(data, userId) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    const checkUserName = await this.findAUserByUserName(data.userName);
    if (checkUserName != null || checkUserName != undefined) {
      throw new GereralException(
        ErrorTypeEnum.NOT_FOUND,
        'This userName is exist.',
      );
    }

    const foundedProfileImage = await this.mediaService.findById(
      data.profileImage,
      whereCondition,
      populateCondition,
      selectCondition,
    );
    if (data.profileImage) {
      if (!foundedProfileImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'profileImage not uploaded or does not exist.',
        );
      }
    }

    const foundedHeaderImage = await this.mediaService.findById(
      data.headerImage,
      whereCondition,
      populateCondition,
      selectCondition,
    );
    if (data.headerImage) {
      if (!foundedHeaderImage) {
        throw new GereralException(
          ErrorTypeEnum.NOT_FOUND,
          'headerImage not uploaded or does not exist.',
        );
      }
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedNewPassword = bcrypt.hashSync(String(data.password), salt);

    const newUser = {
      firstName: data.firstName ? data.firstName : null,
      lastName: data.lastName ? data.lastName : null,
      userName: data.userName ? data.userName : null,
      mobile: data.mobile ? data.mobile : null,
      password: data.password ? hashedNewPassword : null,
      roles: data.roles ? data.roles : null,
      activationStatus: data.activationStatus ? data.activationStatus : null,
      verificationStatus: data.verificationStatus
        ? data.verificationStatus
        : null,
      insertedBy: userId,
      insertDate: new Date(),
      updatedBy: userId,
      updateDate: new Date(),
    };

    const insertedUser = await this.userRepository.insertUser(newUser);

    if (
      data.nationalCode ||
      data.levelOfEducation ||
      data.nickName ||
      data.fatherName ||
      data.email ||
      data.website ||
      data.telephone ||
      data.fax ||
      data.biography ||
      data.profileImage ||
      data.headerImage
    ) {
      const userInfoData = {
        user: insertedUser._id,
        nationalCode: data.nationalCode,
        levelOfEducation: data.levelOfEducation,
        nickName: data.nickName,
        fatherName: data.fatherName,
        email: data.email,
        website: data.website,
        telephone: data.telephone,
        fax: data.fax,
        biography: data.biography,
        profileImage: foundedProfileImage._id,
        headerImage: foundedHeaderImage._id,
        insertedBy: userId,
        insertDate: new Date(),
        updatedBy: userId,
        updateDate: new Date(),
      };

      const insertedUserInfo = await this.userInfoRepository.create(
        userInfoData,
      );

      const newUserInfo = {
        info: insertedUserInfo._id,
      };
      await this.userRepository.editUser(insertedUser._id, newUserInfo);
    }

    return await this.findAUserById(insertedUser._id);
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async getUserByEmail(userEmail) {
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
        throw new GereralException(
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
    //     throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage)
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
    //     throw new GereralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
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
    //'firstName lastName address avatar lang title userName StorX email mobile walletAddress roles info activationStatus activationStatusChangeReason activationStatusChangedBy activationStatusChangeDate verificationStatus verificationStatusChangeReason verificationStatusChangedBy verificationStatusChangeDate insertedBy insertDate updatedBy updateDate isDeletable isDeleted deletedBy deleteDate deletionReason'
    //this.getUserKeys();

    return await this.userRepository.findUserById(
      userId,
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

  async getUserProfileByUserNameFromUser(userName) {
    const whereCondition = {
      isDeleted: false,
      // activationStatus: UserActivationStatusEnum.ACTIVE,
      // verificationStatus: UserVerificationStatusEnum.VERIFIED,
    };
    const populateCondition = [
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    const selectCondition = this.getUserKeys();

    return await this.userRepository.findAUserByUserName(
      userName,
      whereCondition,
      populateCondition,
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
          { userName: { $regex: searchText, $options: 'i' } },
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
          select: '_id userName mobile firstName lastName',
        },
        {
          path: 'updatedBy',
          select: '_id userName mobile firstName lastName',
        },
        {
          path: 'deletedBy',
          select: '_id userName mobile firstName lastName',
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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

  async credential(data) {
    console.log('We are in credential');

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

    console.log('this.user:', this.user);

    if (this.user) {
      const isValidPassword = await this.validateUserPassword(
        data.password,
        this.user.password,
      );

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

        return await response;
      } else {
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
      }
    } else {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
  }

  async adminCredential(data) {
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

    console.log('this.user:', this.user);

    if (this.user) {
      if (
        !this.user ||
        !this.user?.roles[0].name ||
        this.user?.roles[0].name != 'super_admin'
      ) {
        throw new GereralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied.');
      }

      const isValidPassword = await this.validateUserPassword(
        data.password,
        this.user.password,
      );

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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
      }
    } else {
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, 'User not found.');
    }
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
          throw new GereralException(
            418,
            'Entered refresh token is invalid and we cant verify it. ' + error,
          );
        } else {
          if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
            // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            throw new GereralException(
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
          throw new GereralException(
            418,
            'Entered access token is invalid and we cant verify it. ' + error,
          );
        } else {
          if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
            // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            throw new GereralException(
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
      userName: data.userName ? data.userName : '',
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
      userName: data.userName ? data.userName : '',
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
          { userName: { $regex: searchText, $options: 'i' } },
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
          select: 'firstName lastName userName mobile',
        },
        {
          path: 'updatedBy',
          select: 'firstName lastName userName mobile',
        },
        {
          path: 'deletedBy',
          select: 'firstName lastName userName mobile',
        },
      ],
      limit: limit,
      select:
        'firstName lastName avatar lang title userName StorX mobile roles info activationStatus activationStatusChangeReason activationStatusChangedBy activationStatusChangeDate verificationStatus verificationStatusChangeReason verificationStatusChangedBy verificationStatusChangeDate insertedBy insertDate updatedBy updateDate isDeletable isDeleted deletedBy deleteDate deletionReason',
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

  async insertAUserByEmail(body) {
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
      userName: body.email,
      password: bcrypt.hashSync(String(body.password), salt),
      StorX: body.StorX || {},
      roles: roles,
      insertDate: new Date(),
      updateDate: new Date(),
    };

    const insertedUser = await this.userRepository.insertUser(newUser);
    console.log('User inserted!');
    return insertedUser;
  }

  async insertUserByEmail(body) {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = this.getUserKeys();

    console.log('I am in insertUserByEmail service!');

    await this.findAUserByEmail(
      body.email,
      whereCondition,
      populateCondition,
      selectCondition,
    );

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
        userName: body.email,
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
    const populateCondition = [];
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
    console.log('response are: ', response);

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
        throw new GereralException(
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
            throw new GereralException(
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
                  throw new GereralException(
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
                    throw new GereralException(
                      ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                      errorMessage,
                    );
                  });
                this.result = data;
              })
              .catch((error) => {
                const errorMessage =
                  'Some errors occurred while deleting all user devices in user service!';
                throw new GereralException(
                  ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                  errorMessage,
                );
              });
            this.result = data;
          })
          .catch((error) => {
            const errorMessage =
              'Some errors occurred get user devices for deletion in user service!';
            throw new GereralException(
              ErrorTypeEnum.UNPROCESSABLE_ENTITY,
              errorMessage,
            );
          });
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while deleting activities in user service!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
