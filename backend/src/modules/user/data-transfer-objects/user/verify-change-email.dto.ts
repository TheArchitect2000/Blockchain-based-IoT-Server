import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyChangeEmailWithTokenDto {
  @IsNotEmpty({ message: 'token is required and must be entered.' })
  @IsString({ message: 'token must be string.' })
  @ApiProperty({ required: true })
  token: string;
}


export class requestChangeEmailWithTokenDto {
  @IsNotEmpty({ message: 'newEmail is required and must be entered.' })
  @IsString({ message: 'newEmail must be string.' })
  @ApiProperty({ required: true })
  newEmail: string;
}