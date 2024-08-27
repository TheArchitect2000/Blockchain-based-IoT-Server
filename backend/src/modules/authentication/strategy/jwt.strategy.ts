import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('process.env.ACCESS_TOKEN_SECRET_KEY:1111111111111111111');
    console.log(process.env.ACCESS_TOKEN_SECRET_KEY);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      algorithms: [
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
        'none',
      ],
    });
  }

  async validate(payload: any) {
    var util = require('util');
    /* console.log(
      'We are in validate function in authentication module and payload is: ' +
        util.inspect(payload, { showHidden: false, depth: null, colors: true }),
    ); */

    /* if(payload.exp < Math.floor(Date.now()/1000)){      // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            console.log("payload is expired!");
            throw new GeneralException(401, 'Entered access token is expired please get new token.');
        } */

    return { userId: payload.sub, email: payload.email };
  }
}
