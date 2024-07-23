import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyOtpCodeSentByEmailDto {
  @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'otp is required and must be entered.' })
  @IsNumber({}, { message: 'otp must be number.' })
  @ApiProperty({ required: true })
  otp: string;

  @IsNotEmpty({ message: 'otpType is required and must be entered.' })
  @IsString({ message: 'otpType must be string.' })
  @ApiProperty({ required: true })
  otpType: string;
}
