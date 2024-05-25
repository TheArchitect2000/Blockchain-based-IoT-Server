import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDefined,
  MaxLength,
  ArrayMinSize,
  IsString,
  MinLength,
  ValidateNested,
  ArrayUnique,
  Matches,
  IsBoolean,
  IsNumber,
  IsNumberOptions,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { levelOfEducationEnum } from './../../enums/level-of-education.enum';
import { UserActivationStatusEnum } from './../../enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from './../../enums/user-verification-status.enum';

export class insertUserByPanelDto {
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

  @Matches(/^(09){1}[0-9]{9}$/, { message: 'mobile number is not valid' })
  @IsNotEmpty({ message: 'mobile is required and must be entered.' })
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: true })
  mobile: string;

  @IsOptional()
  @MinLength(6, { message: 'password cannot be less than 6 letters.' })
  @IsString({ message: 'password must be string.' })
  @ApiProperty({ required: false })
  password: string;

  @IsOptional()
  @ArrayUnique({ message: 'Duplicate ID selected.' })
  @ArrayMinSize(1, { message: 'At least one role must be selected.' })
  @IsString({ message: 'roles must be array of string.' })
  @ApiProperty({ required: false })
  roles: string[];

  @IsOptional()
  @IsEnum(UserActivationStatusEnum, {
    message: 'The value entered is invalid.',
  })
  @ApiProperty({ required: false })
  activationStatus: string;

  @IsOptional()
  @IsEnum(UserVerificationStatusEnum, {
    message: 'The value entered is invalid.',
  })
  @ApiProperty({ required: false })
  verificationStatus: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  nationalCode: number;

  @IsOptional()
  @IsEnum(levelOfEducationEnum, { message: 'The value entered is invalid.' })
  @ApiProperty({ required: false })
  levelOfEducation: string;

  @IsOptional()
  @MinLength(2, { message: 'nickName cannot be less than 2 letters.' })
  @ApiProperty({ required: false })
  nickName: string;

  @IsOptional()
  @MinLength(2, { message: 'fatherName cannot be less than 2 letters.' })
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
