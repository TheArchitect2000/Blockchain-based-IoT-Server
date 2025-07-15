import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Patch,
  Delete,
  Request,
  Response,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { UserService } from '../services/user/user.service';
import { verifyOtpCodeDto } from '../data-transfer-objects/user/verify-otp-code.dto';
import { verifyResetPasswordCodeDto } from './../data-transfer-objects/user/verify-reset-password-code.dto';
import {
  checkPasswordDto,
  credentialDto,
} from './../data-transfer-objects/user/credential.dto';
import { refreshTokensDto } from './../data-transfer-objects/user/refresh-tokens.dto';
import { UserActivationStatusEnum } from './../enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from './../enums/user-verification-status.enum';
import { User } from 'src/modules/utility/services/user.entity';
import { MailService } from 'src/modules/utility/services/mail.service';
import { verifyOtpCodeSentByEmailDto } from '../data-transfer-objects/user/verify-otp-code-sent-by-email.dto';
import { changePasswordByEmailDto } from '../data-transfer-objects/user/change-password-by-email.dto';
import { signupByEmailDto } from '../data-transfer-objects/user/signup-by-email.dto';
import { Response as Res } from 'express';
import { join } from 'path';
import {
  editUserByUserDto,
  setUserIdentityWalletDto,
} from '../data-transfer-objects/user/edit-user-by-user.dto';
import { verifyEmailDto } from '../data-transfer-objects/user/verify-email.dto';
import { VirtualMachineHandlerService } from 'src/modules/virtual-machine/services/service-handler.service';
import { makeUserAdminDto } from '../data-transfer-objects/user/make-user-admin.dto';
import {
  requestChangeEmailWithTokenDto,
  verifyChangeEmailWithTokenDto,
} from '../data-transfer-objects/user/verify-change-email.dto';
var fs = require('fs');

@ApiTags('Manage Users')
@Controller('app')
export class UserController {
  private result;

  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    //private readonly userRoleService: UserRoleService,
    private readonly VirtualMachineService?: VirtualMachineHandlerService,
  ) {}

  async isAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      (profile?.roles.some((role) => role.name === 'super_admin') == false &&
        profile?.roles.some((role) => role.name === 'user_admin') == false)
    ) {
      return false;
    } else {
      return true;
    }
  }

  async isDeviceAdmin(userId: string) {
    const profile = (await this.userService.getUserProfileByIdFromUser(
      userId,
    )) as any;
    if (
      !profile ||
      !profile?.roles[0]?.name ||
      profile?.roles.some((role) => role.name === 'device_admin') == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  /* @Post('user/test')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async test() {
    // @Param('mobile') mobile: string
    console.log('We are in test function!');
    var user = <User>{};
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    user.name = 'Hamid';
    user.email = 'sahebkherad@gmail.com';
    await this.mailService.sendUserConfirmation(user, token);

    console.log('Email sent!');

    // return await this.userService.sendOTPCode(mobile)
  } */

  @Post('v1/user/request-otp-code-for-signup-by-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user by email for Signup.',
    description: 'This api requires a user email and password.',
  })
  async sendOTPCodeForSignupByEmail(
    @Body() body: signupByEmailDto,
    @Request() request,
  ) {
    return await this.userService.sendOTPCodeForSignupByEmail({
      ...body,
      email: body.email.toString().toLocaleLowerCase(),
    });
  }

  @Post('v1/user/request-otp-code-for-reset-password-by-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user by email for reset password.',
    description: 'This api requires a user email.',
  })
  async sendOTPCodeForResetPasswordByEmail(
    @Body() body: changePasswordByEmailDto,
    @Request() request,
  ) {
    return await this.userService.sendOTPCodeForResetPasswordByEmail(body);
  }

  @Post('v1/user/request-otp-code-for-verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user by email for verify email.',
    description: 'This api requires a user email.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async sendOTPCodeForVerifyEmail(
    @Body() body: verifyEmailDto,
    @Request() request,
  ) {
    return await this.userService.sendOTPCodeForVrifyEmail(request.user.email);
  }

  @Get('v1/user/verify-otp-code-sent-by-email-for-signup')
  @HttpCode(200)
  @ApiOperation({
    summary: 'verify otp code to user by email.',
    description: 'This api requires a user email.',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'Email',
  })
  @ApiQuery({
    name: 'otp',
    type: String,
    required: true,
    description: 'OTP',
  })
  async verifyOTPCodeSentByEmailForSignup(
    @Query('email') email: string,
    @Query('otp') otp: string,
    @Body() body: verifyOtpCodeSentByEmailDto,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForSignup function!');
    console.log('Email is: ', email);
    console.log('OTP is: ', otp);

    try {
      const otpIsVerified =
        await this.userService.verifyOtpCodeSentByEmailForSignup(body);

      const filePath = otpIsVerified
        ? join(
            __dirname,
            '../../../../assets/web-pages/signup-congrat-msg.html',
          )
        : join(
            __dirname,
            '../../../../assets/web-pages/signup-unsuccessful-msg.html',
          );

      // Read file as a string
      const pgResp = await fs.promises.readFile(filePath, { encoding: 'utf8' });

      const responseHtml = pgResp
        .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
        .replace(/{{NodeName}}/g, process.env.NODE_NAME);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(responseHtml);
    } catch (error) {
      console.error('Error verifying OTP or reading file:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.write('<h1>Internal Server Error</h1>');
    } finally {
      res.end();
    }
  }

  @Get('v1/user/verify-otp-code-sent-by-email-for-reset-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'verify otp code to user by email.',
    description: 'This api requires a user email.',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'Email',
  })
  @ApiQuery({
    name: 'otp',
    type: String,
    required: true,
    description: 'OTP',
  })
  async verifyOTPCodeSentByEmailForResetPassword(
    @Query('email') email: string,
    @Query('otp') otp: string,
    @Body() body: verifyOtpCodeSentByEmailDto,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForResetPassword function!');
    console.log('Email is: ', email);
    console.log('OTP is: ', otp);

    try {
      // Read the HTML file
      const filePath = join(
        __dirname,
        '../../../../assets/web-pages/reset-pass-page.html',
      );

      const otpCode =
        await this.userService.verifyOtpCodeSentByEmailForResetPassword(body);

      let htmlContent = await fs.promises.readFile(filePath, 'utf8');

      htmlContent = htmlContent
        .replace(
          '{{ url }}',
          `${process.env.HOST_PROTOCOL}${process.env.PANEL_URL}/app/v1/user/reset-password-by-otp-code`,
        )
        .replace('{{ email }}', email)
        .replace('{{ otp }}', otpCode)
        .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
        .replace(/{{NodeName}}/g, process.env.NODE_NAME);

      // Respond with the updated HTML content
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(htmlContent);
      res.end();
    } catch (error) {
      console.error('Error verifying OTP or reading file:', error);

      // Show unsuccessful page
      try {
        const errorFilePath = join(
          __dirname,
          '../../../../assets/web-pages/reset-pass-unsuccessful-msg.html',
        );
        const pgResp = await fs.promises.readFile(errorFilePath, 'utf8');

        const responseHtml = pgResp
          .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
          .replace(/{{NodeName}}/g, process.env.NODE_NAME);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(responseHtml);
      } catch (readError) {
        console.error('Error reading unsuccessful message page:', readError);
        res.writeHead(404);
        res.write('Response web page does not found!');
      } finally {
        res.end();
      }
    }
  }

  @Get('v1/user/verify-otp-code-sent-by-email-for-verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'verify otp code to user by email.',
    description: 'This api requires a user email.',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'Email',
  })
  @ApiQuery({
    name: 'otp',
    type: String,
    required: true,
    description: 'OTP',
  })
  async verifyOTPCodeSentByEmailForVerifyEmail(
    @Query('email') email: string,
    @Query('otp') otp: string,
    @Body() body: verifyOtpCodeSentByEmailDto,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForVerifyEmail function!');
    console.log('Email is: ', email);
    console.log('OTP is: ', otp);

    try {
      // Verify the OTP code
      const otpIsVerified =
        await this.userService.verifyOtpCodeSentByEmailForVerify(body);

      // Read the appropriate HTML file based on verification status
      const filePath = otpIsVerified
        ? join(
            __dirname,
            '../../../../assets/web-pages/verify-email-congrat-msg.html',
          )
        : join(
            __dirname,
            '../../../../assets/web-pages/verify-email-unsuccessful-msg.html',
          );

      const pgResp = await fs.promises.readFile(filePath, 'utf8');

      const responseHtml = pgResp
        .replace(/{{NodeImageSrc}}/g, process.env.THEME_LOGO)
        .replace(/{{NodeName}}/g, process.env.NODE_NAME);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(responseHtml);
      res.end();
    } catch (error) {
      console.error('Error verifying OTP or reading file:', error);
      res.writeHead(404);
      res.write('Response web page does not found!');
      res.end();
    }
  }

  @Post('v1/user/verify-otp-code-sent-by-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verify otp code sent by email.',
    description: 'This api requires a user email and sent OTP.',
  })
  async verifyOtpCodeSentByEmail(
    @Body() body: verifyOtpCodeSentByEmailDto,
    @Request() request,
  ) {
    console.log('We are in verifyOtpCodeSentByEmail function!');
    return await this.userService.verifyOtpCodeSentByEmailForSignup(body);
  }

  @Post('v1/user/change-password-and-activate-account')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Change password and activate account.',
    description: 'This api requires a user email and password.',
  })
  async changePasswordAndActivateAccount(
    @Body() body: changePasswordByEmailDto,
    @Request() request,
  ) {
    console.log('We are in changePasswordAndActivateAccount function!');
    return await this.userService.changePasswordAndActivateAccount(body);
  }

  @Get('v1/user/request-otp-code/:mobile')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async sendOTPCode(@Param('mobile') mobile: string) {
    return await this.userService.sendOTPCode(mobile);
  }

  @Patch('v1/user/reset-password-by-otp-code')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verifies otp code received by user.',
    description: 'Verifies otp code received by user for reseting password.',
  })
  async verifyOtpCode(@Body() body: verifyOtpCodeDto, @Request() request) {
    const res1 = await this.userService.verifyOtpCode(body);
    if (res1 === true) {
      console.log('Password Changed');

      await this.userService.changePasswordAndActivateAccount({
        ...body,
        newPassword: body.password,
      });
      return true;
    } else {
      console.log('Password not Changed');
      return false;
    }
  }

  @Post('v1/user/credential')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async credential(@Body() body: credentialDto) {
    console.log('body:', body);

    return await this.userService.credential({
      ...body,
      email: body.email.toString().toLocaleLowerCase(),
    });
  }

  @Post('v1/user/admin-credential')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async adminCredential(@Body() body: credentialDto, @Request() request) {
    const emails = process.env.SUPER_ADMIN_EMAILS;

    if (emails.includes(body.email)) {
      console.log('Included');
      const adminRes = await this.userService.makeUserAdmin(body.email, [
        'super',
      ]);
    }
    return await this.userService.adminCredential({
      ...body,
      email: body.email.toString().toLocaleLowerCase(),
    });
  }

  @Post('v1/user/check-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Checks the passwords.',
    description: 'This api compare normal and hashed passwords.',
  })
  async checkPasswords(@Body() body: checkPasswordDto, @Request() request) {
    return await this.userService.checkUserPasswords(body);
  }

  @Post('v1/user/refresh-tokens')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async refreshTokens(@Body() body: refreshTokensDto, @Request() request) {
    return await this.userService.refreshTokens(body);
  }

  /* @Get('v1/user/validate-smart-contract-console')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Validates remix IDE user and pass.',
    description: 'This API validates the remix IDE user and pass.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateSmartContractConsole(
    @Query('user') user: string,
    @Query('pass') pass: string,
    @Request() request,
  ) {
    if (process.env.REMIX_USER === user && process.env.REMIX_PASS === pass) {
      return true;
    } else {
      return false;
    }
  } */

  /* @Get('v1/user/validate-zkp-commitment-console')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Validates remix IDE user and pass.',
    description: 'This API validates the remix IDE user and pass.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateZkpConsole(
    @Query('user') user: string,
    @Query('pass') pass: string,
    @Request() request,
  ) {
    if (process.env.ZKP_USER === user && process.env.ZKP_PASS === pass) {
      return true;
    } else {
      return false;
    }
  } */

  @Get('v1/user/get-my-profile')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get my profile.',
    description: 'This api requires token.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyProfile(@Request() request) {
    if (
      request.user.userId === null ||
      request.user.userId === undefined ||
      String(request.user.userId) === '' ||
      Types.ObjectId.isValid(String(request.user.userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.userService.findAUserById(request.user.userId);
  }

  @Get('v1/user/get-user-by-email/:userEmail')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a user by email.',
    description: 'Gets a user by user email. This api requires a user email.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserByEmail(
    @Param('userEmail') userEmail: string,
    @Request() request,
  ) {
    if (userEmail === null || userEmail === undefined || userEmail === '') {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User email is required and must be entered and must be entered correctly.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.email !== userEmail) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    await this.userService
      .getUserByEmail(userEmail)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Post('v1/user/set-my-identitity-wallet')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Set user identity wallet.',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async setMyIdentityWallet(
    @Body() body: setUserIdentityWalletDto,
    @Request() request,
  ) {
    return await this.userService.setUserIdentityWallet(request.user.userId, body.wallet);
  }

  @Post('v1/user/set-my-ownership-wallet')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Set user ownership wallet.',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async setMyOwnerShipWallet(
    @Body() body: setUserIdentityWalletDto,
    @Request() request,
  ) {
    return await this.userService.setUserOwnerShipWallet(request.user.userId, body.wallet);
  }

  @Patch('v1/user/edit-user-by-user/:userId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Edit user by user.',
    description:
      'Edit user by user. This api requires a user data in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editUserByUser(
    @Param('userId') userId: string,
    @Body() body: editUserByUserDto,
    @Request() request,
  ) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return await this.userService.editUserByUser(userId, body);
  }

  @Patch('v1/user/change-my-profile-activation')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Change user profile activation.',
    description:
      'Change user profile activation. This api requires a user token.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeMyProfileActivation(@Request() request) {
    if (
      request.user.userId === null ||
      request.user.userId === undefined ||
      String(request.user.userId) === '' ||
      Types.ObjectId.isValid(String(request.user.userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.userService.changeMyProfileActivation(
      request.user.userId,
    );
  }

  @Get('v1/user/request-reset-password-code')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register a user by mobile.',
    description:
      'Register a user by user mobile. This api requires a user mobile.',
  })
  async sendOTPForChangePassword(@Request() request) {
    console.log('user email: ', request.user.email);

    return await this.userService.sendOTPForChangePassword(request.user.email);
  }

  @Patch('v1/user/verify-reset-password-code')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verifies otp code received by user .',
    description: 'Verifies otp code received by user and register',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async otpVerificationForChangePassword(
    @Body() body: verifyResetPasswordCodeDto,
    @Request() request,
  ) {
    return await this.userService.otpVerificationAndChangePassword(body);
  }

  @Get('v1/user/get-profile-by-id/:userId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'Gets a user by user id. This api requires a user id.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserProfileByIdFromUser(
    @Param('userId') userId: string,
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    const isDeviceAdmin = await this.isDeviceAdmin(request.user.userId);

    if (
      isAdmin === false &&
      isDeviceAdmin === false &&
      request.user.userId !== userId
    ) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return await this.userService.getUserProfileByIdFromUser(userId);
  }

  @Get('v1/user/get-profile-by-email/:userEmail')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a user by userEmail.',
    description:
      'Gets a user by user userEmail. This api requires a user userEmail.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserProfileByuserEmailFromUser(
    @Param('userEmail') userEmail: string,
    @Request() request,
  ) {
    if (userEmail === null || userEmail === undefined || userEmail === '') {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'userEmail is required and must be entered.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.email !== userEmail) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return await this.userService.getUserProfileByUserEmail(userEmail);
  }

  @Get('v1/user/check-user-email-is-exists/:userEmail')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Checks a user existance by email.',
    description:
      'Checks a user existance by email. This api requires a user email.',
  })
  async checkUserEmailIsExist(@Param('userEmail') userEmail: string) {
    if (userEmail === null || userEmail === undefined || userEmail === '') {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'email is required and must be entered.',
      );
    }

    return await this.userService.checkUserEmailIsExist(userEmail);
  }

  @Post('user/give-admin')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Make an user into admin.',
    description: 'This api will give user admin ranks.',
  })
  async makeUserAdmin(@Body() body: makeUserAdminDto, @Request() request) {
    if (body.userEmail) {
      if (
        body.userEmail === null ||
        body.userEmail === undefined ||
        body.userEmail === ''
      ) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'userEmail is required and must be entered and must be entered correctly.',
        );
      }
    }

    const emails = process.env.SUPER_ADMIN_EMAILS;

    if (!emails.includes(request.user.email.toString())) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied !');
    }

    return await this.userService.makeUserAdmin(body.userEmail, body.roleNames);
  }

  @Get('user/get-short-roles/:userEmail')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user roles short names.',
    description: 'This api will return short name of the user roles.',
  })
  async getUserShortRoles(
    @Param('userEmail') userEmail: string,
    @Request() request,
  ) {
    if (userEmail) {
      if (userEmail === null || userEmail === undefined || userEmail === '') {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'userEmail is required and must be entered and must be entered correctly.',
        );
      }
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.email !== userEmail) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return this.userService.getUserShortRolesByUserEmail(userEmail);
  }

  @Post('user/take-admin')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Take an user admin ranks.',
    description: 'This api will take user admin ranks.',
  })
  async takeUserAdminRanks(@Body() body: makeUserAdminDto, @Request() request) {
    if (body.userEmail) {
      if (
        body.userEmail === null ||
        body.userEmail === undefined ||
        body.userEmail === ''
      ) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'userEmail is required and must be entered and must be entered correctly.',
        );
      }
    }

    const emails = process.env.SUPER_ADMIN_EMAILS;

    if (!emails.includes(request.user.email.toString())) {
      throw new GeneralException(ErrorTypeEnum.UNAUTHORIZED, 'Access Denied !');
    }

    return await this.userService.takeUserAdminRanks(
      body.userEmail,
      body.roleNames,
    );
  }

  @Patch('user/change-profile-activation/:userId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Edit user profile by user.',
    description:
      'Edit user profile by user. This api requires a user profile in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeUserProfileActivationByPanel(
    @Param('userId') userId: string,
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      String(userId) === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return await this.userService.changeUserProfileActivationByPanel(
      userId,
      request.user.userId,
    );
  }

  @Patch('user/change-profile-verification/:userId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Edit user profile by user.',
    description:
      'Edit user profile by user. This api requires a user profile in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeUserProfileVerificationByPanel(
    @Param('userId') userId: string,
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      String(userId) === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    return await this.userService.changeUserProfileVerificationByPanel(
      userId,
      request.user.userId,
    );
  }

  @Get('v1/user/get-all-users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users.',
    description: 'Gets all users.',
  })
  async getAllUsers(@Request() request) {
    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    await this.userService
      .getAllUsers()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching users!';

        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Get('user/search')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'Gets a user by user id. This api requires a user id.',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    required: false,
    description: 'Number of Page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit item in each page ',
  })
  @ApiQuery({
    name: 'sortMode',
    type: String,
    required: false,
    description: 'sortMode of all advertising',
  })
  @ApiQuery({
    name: 'searchText',
    type: String,
    required: false,
    description: 'Each text you want to search',
  })
  @ApiQuery({
    name: 'fromDate',
    type: String,
    required: false,
    description: 'From Date',
  })
  @ApiQuery({
    name: 'toDate',
    type: String,
    required: false,
    description: 'To Date',
  })
  @ApiQuery({
    name: 'users',
    type: String,
    required: false,
    description: 'users of all advertising',
  })
  @ApiQuery({
    name: 'activation',
    type: String,
    required: false,
    enum: UserActivationStatusEnum,
    enumName: 'activation',
    description: 'Activation status of users',
  })
  @ApiQuery({
    name: 'verification',
    type: String,
    required: false,
    enum: UserVerificationStatusEnum,
    enumName: 'verification',
    description: 'Verification status of users',
  })
  async searchUsers(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
    @Query('sortMode') sortMode: string,
    @Query('searchText') searchText: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('users') users: any,
    @Query('activation') activation: string,
    @Query('verification') verification: string,
    @Request() request,
  ) {
    pageNumber = pageNumber ? pageNumber : 1;
    limit = limit ? limit : 20;
    sortMode = sortMode ? sortMode : 'desc';
    searchText = searchText ? searchText : '';
    users = users
      ? users.split(',').filter((e) => Types.ObjectId.isValid(e))
      : [];
    activation = activation ? activation : '';
    verification = verification ? verification : '';
    fromDate = fromDate ? fromDate : '';
    toDate = toDate ? toDate : '';

    fromDate = fromDate
      ? new Date(fromDate).toISOString()
      : new Date('2019/01/01').toISOString();
    toDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();

    if (fromDate > toDate) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'Start date cant be grater than end date .',
      );
    }

    return await this.userService.searchInUsersByPanel(
      pageNumber,
      limit,
      sortMode,
      searchText,
      users,
      activation,
      verification,
      fromDate,
      toDate,
      request.user.userId,
    );
  }

  @Delete('v1/user/delete-all-user-data')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletes all user data.',
    description: 'This api requires user id.',
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: 'user ID',
  })
  async deleteAllUserDataByUserId(
    @Query('userId') userId: string,
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      let errorMessage = 'User id is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    const isAdmin = await this.isAdmin(request.user.userId);

    if (isAdmin === false && request.user.userId !== userId) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied');
    }

    await this.VirtualMachineService.deleteAllUserVirtualMachines(userId);

    await this.userService
      .deleteAllUserDataPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user data in user controller!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  @Post('v1/user/request-change-email-token')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generating change email token.',
    description: 'This api save a token for changin email in database.',
  })
  async generateChangeEmailToken(
    @Body() body: requestChangeEmailWithTokenDto,
    @Request() request,
  ) {
    const res = await this.userService.generateAndSaveChangeEmailToken({
      userId: request.user.userId,
      newEmail: body.newEmail,
      nowEmail: request.user.email,
    });

    return res;
  }

  @Post('v1/user/verify-change-email-with-token')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generating change email token.',
    description: 'This api save a token for changin email in database.',
  })
  async verifyChangeEmailWithToken(
    @Body() body: verifyChangeEmailWithTokenDto,
    @Request() request,
  ) {
    const res = await this.userService.verifyChangeEmailWithToken(body.token);
    return res;
  }
}
