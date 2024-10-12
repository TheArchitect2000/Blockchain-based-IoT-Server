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
  @MinLength(5, { message: 'email cannot be less than 5 letters.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: false })
  mobile: string;

  @IsOptional()
  @MinLength(5, { message: 'walletAddress cannot be less than 5 letters.' })
  @IsString({ message: 'walletAddress must be string.' })
  @ApiProperty({ required: false })
  walletAddress: string;

  @IsOptional()
  @IsString({ message: 'title must be string.' })
  @ApiProperty({ required: false })
  title: string;

  @IsOptional()
  @IsString({ message: 'avatar must be string.' })
  @ApiProperty({ required: false })
  avatar: string;

  @IsOptional()
  @IsString({ message: 'lang must be string.' })
  @ApiProperty({ required: false })
  lang: string;
}
