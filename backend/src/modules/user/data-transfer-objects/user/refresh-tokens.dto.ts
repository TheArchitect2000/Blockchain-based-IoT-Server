import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
  IsNumberOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class refreshTokensDto {
  @IsNotEmpty({ message: 'oldAccessToken is required and must be entered.' })
  @IsString({ message: 'oldAccessToken must be string.' })
  @ApiProperty({ required: true })
  oldAccessToken: string;

  @IsNotEmpty({ message: 'refreshToken is required and must be entered.' })
  @IsString({ message: 'refreshToken must be string.' })
  @ApiProperty({ required: true })
  refreshToken: string;
}
