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

export class UserLoginDto {
  // @IsOptional()
  /* @IsNotEmpty({ message: 'username is required and must be entered.' })
    @IsString({ message: 'username must be string.' })
    @ApiProperty({ required: true })
    username: string; */

  // @IsOptional()
  @IsNotEmpty({ message: 'mobile is required and must be entered.' })
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: true })
  mobile: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'password is required and must be entered.' })
  @IsString({ message: 'password must be string.' })
  @ApiProperty({ required: true })
  password: string;
}
