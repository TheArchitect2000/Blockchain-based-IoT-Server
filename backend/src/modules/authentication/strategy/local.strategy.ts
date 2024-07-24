import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { CustomValidatorService } from 'src/modules/utility/services/custom-validator.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authenticationService: AuthenticationService,
    private customValidatorService: CustomValidatorService,
  ) {
    super({
      usernameField: 'mobile',
      passwordField: 'password',
    });
  }

  async validate(mobile: string, password: string): Promise<any> {
    if (this.customValidatorService.isIranMobile(mobile).Success) {
      let validateResult = await this.authenticationService.validateUser(
        mobile,
        password,
      );

      if (validateResult.user) {
        return validateResult.user; // returns user object
      } else {
        if (validateResult.error === 'passwordIncorrect') {
          let errorMessage = 'User name or password is incorrect!'; // User password is incorrect!
          throw new GereralException(ErrorTypeEnum.FORBIDDEN, errorMessage);
          // throw new UnauthorizedException();
        } else if (validateResult.error === 'userNotFound') {
          let errorMessage = 'User not found!';
          throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        }
      }
    } else {
      let errorMessage = 'Mobile number is not valid!'; // User mobile is incorrect!
      throw new GereralException(ErrorTypeEnum.INVALID_INPUT, errorMessage);
    }

    /* const user = await this.authenticationService.validateUser(mobile, password);
        
        if (!user) {
            throw new UnauthorizedException();
        }
        return user; */
  }
}
