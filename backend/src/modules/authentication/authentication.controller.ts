import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { NewTokenRequestDto } from './data-transfer-objects/new-token-request.dto';
import { UserLoginDto } from './data-transfer-objects/user-login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleAuthRequestDto } from './data-transfer-objects/google-auth.dto';
import { AppleAuthRequestDto } from './data-transfer-objects/apple-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';

@ApiTags('Manage Authentication')
@Controller('app/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  @Post('google/token')
  async verifyGoogleToken(@Body('tokenId') tokenId: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Create or find user in the database and generate a JWT
    const user = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
    };
    // Generate a JWT token
    const jwt = 'your_jwt_token_here'; // Use your JWT service to generate the token
    return { jwt, user };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: UserLoginDto, @Request() request) {
    return this.authenticationService.login(request.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    // Successful Google login
    console.log('req.user:', req.user);
    return req.user; // Add logic to handle user (e.g., generate a JWT)
  }
}
