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

export class editUserAndInfoByUserDto {
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
  @MinLength(5, { message: 'walletAddress cannot be less than 5 letters.' })
  @IsString({ message: 'walletAddress must be string.' })
  @ApiProperty({ required: false })
  walletAddress: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  nationalCode: number;

  @IsOptional()
  @IsEnum(levelOfEducationEnum, { message: 'The value entered is invalid.' })
  @ApiProperty({ required: false })
  levelOfEducation: string;

  @IsOptional()
  @ApiProperty({ required: false })
  nickName: string;

  @IsOptional()
  @ApiProperty({ required: false })
  fatherName: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ required: false })
  website: string;

  @IsOptional()
  @ApiProperty({ required: false })
  telephone: string;

  @IsOptional()
  @ApiProperty({ required: false })
  fax: string;

  @IsOptional()
  @MinLength(8, { message: 'userName cannot be less than 8 letters.' })
  @MaxLength(256, { message: 'biography cannot be longer  than 256 letters.' })
  @ApiProperty({ required: false })
  biography: string;

  @IsOptional()
  @ApiProperty({ required: false })
  profileImage: string;

  @IsOptional()
  @ApiProperty({ required: false })
  headerImage: string;
}
