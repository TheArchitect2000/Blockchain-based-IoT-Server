import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { userFeature } from '../user/features/user.feature';
import { ConfigModule } from '@nestjs/config';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '2m' },
    }),
    MongooseModule.forFeature(userFeature),
    UserModule,
    UtilityModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],

  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
