import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDefined,
  MaxLength,
  IsString,
  MinLength,
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsNumberOptions,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { levelOfEducationEnum } from './../../enums/level-of-education.enum';

export class editUserByUserDto {
  @IsOptional()
  @IsString({ message: 'firstName must be string.' })
  @ApiProperty({ required: false })
  firstName: string;

  @IsOptional()
  @IsString({ message: 'lastName must be string.' })
  @ApiProperty({ required: false })
  lastName: string;

  @IsOptional()
  @MinLength(5, { message: 'userName cannot be less than 5 letters.' })
  @IsString({ message: 'userName must be string.' })
  @ApiProperty({ required: false })
  userName: string;

  @IsOptional()
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: false })
  mobile: string;

  @IsOptional()
  @MinLength(5, { message: 'walletAddress cannot be less than 5 letters.' })
  @IsString({ message: 'walletAddress must be string.' })
  @ApiProperty({ required: false })
  walletAddress: string;
}
