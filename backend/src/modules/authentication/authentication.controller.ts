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

@ApiTags('Manage Authentication')
@Controller('app/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  

  @Post('google/token')
  async verifyGoogleToken(@Body('tokenId') tokenId: string) {
    return await this.authenticationService.loginWithGoogle(tokenId)
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    // Successful Google login
    console.log('req.user:', req.user);
    return req.user; // Add logic to handle user (e.g., generate a JWT)
  }
}
