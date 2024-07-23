import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { NewTokenRequestDto } from './data-transfer-objects/new-token-request.dto';
import { UserLoginDto } from './data-transfer-objects/user-login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleAuthRequestDto } from './data-transfer-objects/google-auth.dto';
import { AppleAuthRequestDto } from './data-transfer-objects/apple-auth.dto';

@ApiTags('Manage Authentication')
@Controller('app')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('authentication/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: UserLoginDto, @Request() request) {
    return this.authenticationService.login(request.user);
  }

  @Post('authentication/googleAuth')
  async googleAuth(@Body() body: GoogleAuthRequestDto) {
    return this.authenticationService.googleAuthVerify(body.token);
  }

  @Post('authentication/appleAuth')
  async appleAuth(@Body() body: AppleAuthRequestDto) {
    return this.authenticationService.googleAuthVerify(body.token);
  }

  @Post('v1/authentication/refresh-tokens')
  async refreshTokens(@Body() body: NewTokenRequestDto, @Request() request) {
    return this.authenticationService.createNewTokens(body, request.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@Request() request) {
    return request.user;
  }
}
