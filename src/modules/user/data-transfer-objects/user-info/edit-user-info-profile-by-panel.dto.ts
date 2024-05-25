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

export class EditUserInfoProfileByPanelDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'userId is required and must be entered.' })
  @IsString({ message: 'userId must be string.' })
  @ApiProperty({ required: true })
  userId: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'nickName is required and must be entered.' })
  @IsString({ message: 'nickName must be string.' })
  @ApiProperty({ required: false })
  nickName: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'website is required and must be entered.' })
  @IsString({ message: 'website must be string.' })
  @ApiProperty({ required: false })
  website: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'telephone is required and must be entered.' })
  @IsString({ message: 'telephone must be string.' })
  @ApiProperty({ required: false })
  telephone: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'fax is required and must be entered.' })
  @IsString({ message: 'fax must be string.' })
  @ApiProperty({ required: false })
  fax: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'biography is required and must be entered.' })
  @IsString({ message: 'biography must be string.' })
  @ApiProperty({ required: false })
  biography: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'nationalCode is required and must be entered.' })
  @IsString({ message: 'nationalCode must be string.' })
  @ApiProperty({ required: false })
  nationalCode: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'activationStatus is required and must be entered.' })
  @IsString({ message: 'activationStatus must be string.' })
  @ApiProperty({ required: true })
  activationStatus: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'verificationStatus is required and must be entered.' })
  @IsString({ message: 'verificationStatus must be string.' })
  @ApiProperty({ required: true })
  verificationStatus: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'verificationStatusMessage is required and must be entered.' })
  @IsString({ message: 'verificationStatusMessage must be string.' })
  @ApiProperty({ required: true })
  verificationStatusMessage: string;
}
