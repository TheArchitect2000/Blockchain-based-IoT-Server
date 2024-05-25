import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthRequestDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'token is required and must be entered.' })
  @IsString({ message: 'token must be string.' })
  @ApiProperty({ required: true })
  token: string;
}

export interface GoogleAuthUserResponseDto {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
