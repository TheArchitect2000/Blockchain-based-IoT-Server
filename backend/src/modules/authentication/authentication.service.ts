import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { SignOptions } from 'jsonwebtoken';
import { UserActivationStatusChangeReasonsEnum } from '../user/enums/user-activation-status-change-reasons.enum';
import { UserActivationStatusEnum } from '../user/enums/user-activation-status.enum';
import { UserVerificationStatusChangeReasonsEnum } from '../user/enums/user-verification-status-change-reasons.enum';
import { UserVerificationStatusEnum } from '../user/enums/user-verification-status.enum';
import { UserService } from '../user/services/user/user.service';
import { GeneralException } from '../utility/exceptions/general.exception';
import { GoogleAuthUserResponseDto } from './data-transfer-objects/google-auth.dto';
import { OAuth2Client } from 'google-auth-library';
var jwt = require('jsonwebtoken');

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async validateUser(mobile: string, pass: string): Promise<any> {
    const whereCondition = { isDeleted: false };
    const populateCondition = [];
    const selectCondition = '';

    let passwordIsCorrect: boolean;
    const user = await this.userService.findAUserByMobile(
      mobile,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (user) {
      await bcrypt.compare(String(pass), user.password).then(function (result) {
        if (result) {
          passwordIsCorrect = true;
        } else {
          passwordIsCorrect = false;
        }
      });

      if (passwordIsCorrect) {
        return { user: user, error: null };
      } else {
        return { user: null, error: 'passwordIncorrect' };
      }
    } else {
      return { user: null, error: 'userNotFound' };
    }
    /* if (user && passwordIsCorrect) {
            return user;
        }  */

    return null;
  }

  async loginWithGoogle(tokenId: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
    };

    return await this.userService.credential({
      ...user,
      avatar: user.picture,
    }, true);
  }

  async login(user: any) {
    const payload = { mobile: user.mobile, sub: user._id };
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

  async createNewTokens(data, user: any) {
    const userOldAccessToken = data.oldAccessToken;
    const userRefreshToken = data.refreshToken;
    let decodedAccessToken = { email: '', sub: '', iat: '', exp: '', iss: '' };
    let decodedRefreshToken = { email: '', sub: '', iat: '', exp: '', iss: '' };
    let payload = { email: '', sub: '' };

    jwt.verify(
      userOldAccessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err) {
          console.log('access token error message: ', err.message);
        } else {
          decodedAccessToken = decoded;
          console.log('decoded access token', decoded);
        }
        // next()
      },
    );

    jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err) {
          console.log('refresh token error message: ', err.message);
        } else {
          decodedRefreshToken = decoded;
          console.log('decoded refresh token', decoded);
          if (Number(decodedRefreshToken.exp) < Math.floor(Date.now() / 1000)) {
            // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            throw new GeneralException(
              418,
              'Entered refresh token is expired. please relogin to get new access and refresh token.',
            );
          }
        }
        // next()
      },
    );

    if (
      decodedAccessToken.sub !== '' &&
      decodedRefreshToken.sub !== '' &&
      decodedAccessToken.sub === decodedRefreshToken.sub
    ) {
      payload = {
        email: decodedAccessToken.email,
        sub: decodedAccessToken.sub,
      };
      console.log(payload);

      // const signOptions: SignOptions = { algorithm: 'HS256' };
      const accessSignOptions: SignOptions = {};

      accessSignOptions.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
      accessSignOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;

      switch (process.env.ACCESS_TOKEN_ALGORITHM) {
        case 'HS256':
          accessSignOptions.algorithm = 'HS256';
          break;
        case 'HS384':
          accessSignOptions.algorithm = 'HS384';
          break;
        case 'HS512':
          accessSignOptions.algorithm = 'HS512';
          break;
        case 'RS256':
          accessSignOptions.algorithm = 'RS256';
          break;
        case 'RS384':
          accessSignOptions.algorithm = 'RS384';
          break;
        case 'RS512':
          accessSignOptions.algorithm = 'RS512';
          break;
        case 'PS256':
          accessSignOptions.algorithm = 'PS256';
          break;
        case 'PS384':
          accessSignOptions.algorithm = 'PS384';
          break;
        case 'PS512':
          accessSignOptions.algorithm = 'PS512';
          break;
        case 'ES256':
          accessSignOptions.algorithm = 'ES256';
          break;
        case 'ES384':
          accessSignOptions.algorithm = 'ES384';
          break;
        case 'ES512':
          accessSignOptions.algorithm = 'ES512';
          break;
        default:
          console.log('No such algirithm exists!');
          break;
      }

      // const accessToken = this.jwtService.sign(payload);
      const accessToken = this.jwtService.sign(payload, {
        ...accessSignOptions,
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      // const signOptions: SignOptions = { algorithm: 'HS256' };
      const refreshSignOptions: SignOptions = {};
      refreshSignOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
      refreshSignOptions.issuer = process.env.REFRESH_TOKEN_ISSUER;

      switch (process.env.REFRESH_TOKEN_ALGORITHM) {
        case 'HS256':
          refreshSignOptions.algorithm = 'HS256';
          break;
        case 'HS384':
          refreshSignOptions.algorithm = 'HS384';
          break;
        case 'HS512':
          refreshSignOptions.algorithm = 'HS512';
          break;
        case 'RS256':
          refreshSignOptions.algorithm = 'RS256';
          break;
        case 'RS384':
          refreshSignOptions.algorithm = 'RS384';
          break;
        case 'RS512':
          refreshSignOptions.algorithm = 'RS512';
          break;
        case 'PS256':
          refreshSignOptions.algorithm = 'PS256';
          break;
        case 'PS384':
          refreshSignOptions.algorithm = 'PS384';
          break;
        case 'PS512':
          refreshSignOptions.algorithm = 'PS512';
          break;
        case 'ES256':
          refreshSignOptions.algorithm = 'ES256';
          break;
        case 'ES384':
          refreshSignOptions.algorithm = 'ES384';
          break;
        case 'ES512':
          refreshSignOptions.algorithm = 'ES512';
          break;
        default:
          console.log('No such algirithm exists!');
          break;
      }

      // const refreshToken = this.jwtService.sign(payload, signOptions);

      // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, signOptions );
      // const refreshToken = this.jwtService.sign(payload, { issuer: 'https://www.tamuk.ir' });
      // const refreshToken = jwt.sign(payload, 'testSecret', { algorithm: 'RS256' } );
      // const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' } );
      // const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, refreshSignOptions );

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

    return {};
  }

  async googleAuthVerify(token: string) {
    try {
      const { data: profile } = await axios.get<GoogleAuthUserResponseDto>(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!profile) throw new Error('token is invalid');
      let user = await this.userService.findAUserByEmail(profile.email);
      if (!user) {
        user = await this.userService.insertAUserByEmail({
          email: profile.email,
          password: '123456',
        });

        await this.userService.setActivationStatus(
          user._id,
          UserActivationStatusEnum.ACTIVE,
          UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_GOOGLE,
          user._id,
        );
        await this.userService.setVerificationStatus(
          user._id,
          UserVerificationStatusEnum.VERIFIED,
          UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_GOOGLE,
          user._id,
        );
      }
      const payload = { mobile: user.mobile, sub: user._id };

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
      const response: any = await this.userService.myProfileResponse(user);

      return { ...response, tokens };
    } catch (err) {
      throw new BadRequestException('token is invalid');
    }
  }

  async appleAuthVerify(token: string) {
    try {
      const applePublicKey = await axios.get(
        `https://appleid.apple.com/auth/keys`,
      );
      const decoded = jwt.verify(token, applePublicKey.data, {
        algorithms: ['RS256'],
      });

      if (!decoded) throw new Error('token is invalid');
      let user = await this.userService.findAUserByEmail(decoded.email);
      if (!user) {
        user = await this.userService.insertAUserByEmail({
          email: decoded.email,
          password: '123456',
        });

        await this.userService.setActivationStatus(
          user._id,
          UserActivationStatusEnum.ACTIVE,
          UserActivationStatusChangeReasonsEnum.ACIVATION_BY_USER_VIA_GOOGLE,
          user._id,
        );
        await this.userService.setVerificationStatus(
          user._id,
          UserVerificationStatusEnum.VERIFIED,
          UserVerificationStatusChangeReasonsEnum.VERIFICATION_BY_EMAIL_VIA_GOOGLE,
          user._id,
        );
      }
      const payload = { mobile: user.mobile, sub: user._id };

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
      console.log(user);
      const response: any = await this.userService.myProfileResponse(user);

      return { ...response, tokens };
    } catch (err) {
      throw new BadRequestException('token is invalid');
    }
  }
}
