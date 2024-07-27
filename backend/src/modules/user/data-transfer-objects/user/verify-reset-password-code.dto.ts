import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyResetPasswordCodeDto {
  @IsNotEmpty({ message: 'mobile is required and must be entered.' })
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'otp is required and must be entered.' })
  @IsNumber({}, { message: 'otp must be number.' })
  @ApiProperty({ required: true })
  otp: string;

  @IsNotEmpty({ message: 'newPassword is required and must be entered.' })
  @IsNumber({}, { message: 'newPassword must be number.' })
  @ApiProperty({ required: true })
  newPassword: string;
}
