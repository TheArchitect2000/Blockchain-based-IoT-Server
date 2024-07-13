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
  //Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { ChangeActivationStatusGeneralDto } from 'src/modules/utility/data-transfer-objects/change-activation-status-general.dto';
import { ChangeVerificationStatusGeneralDto } from 'src/modules/utility/data-transfer-objects/change-verification-status-general.dto';
import { DeleteGeneralDto } from 'src/modules/utility/data-transfer-objects/delete-general.dto';
// import { MediaUploadDto } from 'src/modules/utility/data-transfer-objects/media-upload.dto';
import { Permissions } from 'src/modules/utility/decorators/permissions.decorator';
import { ActivationStatusEnum } from 'src/modules/utility/enums/activation-status.enum';
import { BooleanEnum } from 'src/modules/utility/enums/boolean.enum';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { OTPTypeEnum } from 'src/modules/utility/enums/otp-type.enum';
import { SortModeEnum } from 'src/modules/utility/enums/sort-mode.enum';
import { VerificationStatusEnum } from 'src/modules/utility/enums/verification-status.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { PermissionsGuard } from 'src/modules/utility/guards/permissions.guard';
import { editUserProfileByPanelDto } from '../data-transfer-objects/user/edit-user-profile-by-panel.dto';
// import { InsertUserByPanelDto } from '../data-transfer-objects/user/insert-user-by-panel.dto';
import { UserApiPermissionsEnum } from '../enums/user-api-permissions.enum';
import { UserService } from '../services/user/user.service';
import { verifyOtpCodeDto } from '../data-transfer-objects/user/verify-otp-code.dto';
import { verifyResetPasswordCodeDto } from './../data-transfer-objects/user/verify-reset-password-code.dto';
import {
  checkPasswordDto,
  credentialDto,
} from './../data-transfer-objects/user/credential.dto';
import { refreshTokensDto } from './../data-transfer-objects/user/refresh-tokens.dto';
import { insertUserByPanelDto } from './../data-transfer-objects/user/insert-user-by-panel.dto';
import { UserActivationStatusEnum } from './../enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from './../enums/user-verification-status.enum';
import { User } from 'src/modules/utility/services/user.entity'; /// Temp
import { MailService } from 'src/modules/utility/services/mail.service';
import { verifyOtpCodeSentByEmailDto } from '../data-transfer-objects/user/verify-otp-code-sent-by-email.dto';
import { changePasswordByEmailDto } from '../data-transfer-objects/user/change-password-by-email.dto';
import { signupByEmailDto } from '../data-transfer-objects/user/signup-by-email.dto';
import { Response as Res, response } from 'express';
import { join } from 'path';
import { editUserAndInfoByUserDto } from '../data-transfer-objects/user/edit-user-and-info-by-user.dto';
import { editUserByUserDto } from '../data-transfer-objects/user/edit-user-by-user.dto';
import { verifyEmailDto } from '../data-transfer-objects/user/verify-email.dto';
import { IsAdminGuard } from 'src/modules/authentication/guard/is-admin.guard';
var fs = require('fs');

@ApiTags('Manage Users')
@Controller('app')
export class UserController {
  private result;

  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService, /// Test
  ) {}

  @Post('user/test')
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
  }

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
    summary: 'Send otp code to user by email for reset password.',
    description: 'This api requires a user email.',
  })
  async sendOTPCodeForVerifyEmail(
    @Body() body: verifyEmailDto,
    @Request() request,
  ) {
    return await this.userService.sendOTPCodeForVrifyEmail(body);
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
    //@Req() req: Request,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForSignup function!');
    console.log('Email is: ', email);
    console.log('otp is: ', otp);

    let otpIsVerified: boolean = false;

    // let otpIsVerified = await this.userService.verifyOtpCodeSentByEmailForSignup(body);

    await this.userService
      .verifyOtpCodeSentByEmailForSignup(body)
      .then((data) => {
        otpIsVerified = data;

        // Show congratulations page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/signup-congrat-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );
      })
      .catch((error) => {
        // Show unsuccessful page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/signup-unsuccessful-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (!otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );

        // let errorMessage = 'Some errors occurred while user verification by email!';
        // throw new GereralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
      });

    // return await this.userService.verifyOtpCodeSentByEmailForSignup(body);
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
    //@Req() req: Request,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForResetPassword function!');
    console.log('Email is: ', email);
    console.log('otp is: ', otp);

    let otpIsVerified: boolean = false;

    // let otpIsVerified = await this.userService.verifyOtpCodeSentByEmailForResetPassword(body);

    await this.userService
      .verifyOtpCodeSentByEmailForResetPassword(body)
      .then((data) => {
        otpIsVerified = data;

        // Show congratulations page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/reset-pass-congrat-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );
      })
      .catch((error) => {
        // Show unsuccessful page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/reset-pass-unsuccessful-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (!otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );

        // let errorMessage = 'Some errors occurred while user verification by email!';
        // throw new GereralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
      });

    // return await this.userService.verifyOtpCodeSentByEmailForResetPassword(body);
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
    //@Req() req: Request,
    @Response() res: Res,
  ) {
    body.email = email;
    body.otp = otp;
    console.log('We are in verifyOTPCodeSentByEmailForVerifyEmail function!');
    console.log('Email is: ', email);
    console.log('otp is: ', otp);

    let otpIsVerified: boolean = false;

    // let otpIsVerified = await this.userService.verifyOTPCodeSentByEmailForVerifyEmail(body);

    await this.userService
      .verifyOtpCodeSentByEmailForVerify(body)
      .then((data) => {
        otpIsVerified = data;

        // Show congratulations page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/verify-email-congrat-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );
      })
      .catch((error) => {
        // Show unsuccessful page.

        fs.readFile(
          join(
            __dirname,
            '../../../../assets/web-pages/verify-email-unsuccessful-msg.html',
          ),
          function (error, pgResp) {
            if (error) {
              res.writeHead(404);
              res.write('Response web page does not found!');
            } else {
              if (!otpIsVerified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write('<h1> successful </h1>');
                res.write(pgResp);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1> unsuccessful </h1>');
              }
              res.end();
            }

            res.end();
          },
        );

        // let errorMessage = 'Some errors occurred while user verification by email!';
        // throw new GereralException(ErrorTypeEnum.UNPROCESSABLE_ENTITY, errorMessage)
      });

    // return await this.userService.verifyOtpCodeSentByEmailForResetPassword(body);
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
    console.log('New password :', body.newPassword);

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

  @Patch('v1/user/verify-otp-code')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verifies otp code received by user.',
    description: 'Verifies otp code received by user and register or login.',
  })
  async verifyOtpCode(@Body() body: verifyOtpCodeDto, @Request() request) {
    return await this.userService.verifyOtpCode(body);
  }

  @Post('v1/user/credential')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async credential(@Body() body: credentialDto, @Request() request) {
    return await this.userService.credential({
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

  @Get('v1/user/get-my-profile')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get my profile.',
    description: 'This api requires token.',
  })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth()
  async getMyProfile(@Request() request) {
    if (
      request.user.userId === null ||
      request.user.userId === undefined ||
      String(request.user.userId) === '' ||
      Types.ObjectId.isValid(String(request.user.userId)) === false
    ) {
      throw new GereralException(
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
  async getUserByEmail(@Param('userEmail') userEmail: string) {
    if (userEmail === null || userEmail === undefined || userEmail === '') {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User email is required and must be entered and must be entered correctly.',
      );
    }

    await this.userService
      .getUserByEmail(userEmail)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching user!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
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
    return await this.userService.editUserByUser(userId, body);
  }

  @Patch('v1/user/edit-user-and-info-by-user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Edit user and info by user.',
    description:
      'Edit user and info by user. This api requires a user profile in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editUserAndInfoByUser(
    @Body() body: editUserAndInfoByUserDto,
    @Request() request,
  ) {
    if (body.profileImage) {
      if (
        body.profileImage === null ||
        body.profileImage === undefined ||
        body.profileImage === '' ||
        Types.ObjectId.isValid(String(body.profileImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'profileImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    if (body.headerImage) {
      if (
        body.headerImage === null ||
        body.headerImage === undefined ||
        body.headerImage === '' ||
        Types.ObjectId.isValid(String(body.headerImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'headerImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    return await this.userService.editUserAndInfoByUser(
      body,
      request.user.userId,
    );
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
      throw new GereralException(
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
    return await this.userService.sendOTPForChangePassword(request.user.mobile);
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
  async getUserProfileByIdFromUser(@Param('userId') userId: string) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.userService.getUserProfileByIdFromUser(userId);
  }

  @Get('v1/user/get-profile-by-username/:userName')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a user by username.',
    description:
      'Gets a user by user username. This api requires a user username.',
  })
  async getUserProfileByUserNameFromUser(@Param('userName') userName: string) {
    if (userName === null || userName === undefined || userName === '') {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'userName is required and must be entered.',
      );
    }

    return await this.userService.getUserProfileByUserNameFromUser(userName);
  }

  @Get('v1/user/check-username-is-exists/:userName')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by username.',
    description:
      'Gets a user by user username. This api requires a user username.',
  })
  async checkUserNameIsExist(@Param('userName') userName: string) {
    if (userName === null || userName === undefined || userName === '') {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'userName is required and must be entered.',
      );
    }

    return await this.userService.checkUserNameIsExist(userName);
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
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'email is required and must be entered.',
      );
    }

    return await this.userService.checkUserEmailIsExist(userEmail);
  }

  @Post('user/insert')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send otp code to user.',
    description: 'This api requires a user mobile.',
  })
  async insertUserByPanel(
    @Body() body: insertUserByPanelDto,
    @Request() request,
  ) {
    if (body.profileImage) {
      if (
        body.profileImage === null ||
        body.profileImage === undefined ||
        body.profileImage === '' ||
        Types.ObjectId.isValid(String(body.profileImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'profileImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    if (body.headerImage) {
      if (
        body.headerImage === null ||
        body.headerImage === undefined ||
        body.headerImage === '' ||
        Types.ObjectId.isValid(String(body.headerImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'headerImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    return await this.userService.insertUserByPanel(body, request.user.userId);
  }

  @Get('user/get-profile-by-id/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'Gets a user by user id. This api requires a user id.',
  })
  async getUserProfileByIdFromPanel(@Param('userId') userId: string) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    return await this.userService.getUserProfileByIdFromPanel(userId);
  }

  @Patch('v1/user/edit-user-by-panel/:userId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Edit user profile by user.',
    description:
      'Edit user profile by user. This api requires a user profile in json format.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async editUserProfileByPanel(
    @Param('userId') userId: string,
    @Body() body: editUserProfileByPanelDto,
    @Request() request,
  ) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'userId is required and must be entered and must be entered correctly with objectId type.',
      );
    }

    if (body.profileImage) {
      if (
        body.profileImage === null ||
        body.profileImage === undefined ||
        body.profileImage === '' ||
        Types.ObjectId.isValid(String(body.profileImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'profileImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    if (body.headerImage) {
      if (
        body.headerImage === null ||
        body.headerImage === undefined ||
        body.headerImage === '' ||
        Types.ObjectId.isValid(String(body.headerImage)) === false
      ) {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'headerImage is required and must be entered and must be entered correctly with objectId type.',
        );
      }
    }

    return await this.userService.editUserByPanel(
      body,
      userId,
      request.user.userId,
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
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
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
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        'User id is required and must be entered and must be entered correctly with objectId type.',
      );
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
  async getAllUsers() {
    await this.userService
      .getAllUsers()
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while fetching users!';

        throw new GereralException(
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
      throw new GereralException(
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
  async deleteAllUserDataByUserId(@Query('userId') userId: string) {
    if (
      userId === null ||
      userId === undefined ||
      userId === '' ||
      Types.ObjectId.isValid(String(userId)) === false
    ) {
      let errorMessage = 'User id is not valid!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    await this.userService
      .deleteAllUserDataPermanently(userId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting all user data in user controller!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
