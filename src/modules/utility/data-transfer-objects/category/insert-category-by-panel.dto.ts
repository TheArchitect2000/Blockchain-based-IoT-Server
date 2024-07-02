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
import { categoryTypeEnum } from './../../enums/category-type.enum';
import { ActivationStatusEnum } from './../../enums/activation-status.enum';
import { VerificationStatusEnum } from '../../enums/verification-status.enum';

export class insertCategoryByPanelDto {
  @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;

  @IsEnum(categoryTypeEnum, { message: 'The value entered is invalid.' })
  @IsNotEmpty({ message: 'type is required and must be entered.' })
  @IsString({ message: 'type must be string.' })
  @ApiProperty({ required: false })
  type: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  sort: string;

  @IsOptional()
  @IsString({ message: 'parent must be string.' })
  @ApiProperty({ required: false })
  parent: string;

  @IsOptional()
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @IsString({ message: 'image must be string.' })
  @ApiProperty({ required: false })
  image: string;

  @IsOptional()
  @IsString({ message: 'content must be string.' })
  @ApiProperty({ required: false })
  content: string;

  @IsEnum(ActivationStatusEnum, {
    message: 'Selected status item is not in enum list .',
  })
  @IsString({ message: 'activationStatus must be string.' })
  @ApiProperty({ required: false })
  activationStatus: string;

  @IsEnum(ActivationStatusEnum, {
    message: 'Selected status item is not in enum list .',
  })
  @IsString({ message: 'activationStatus must be string.' })
  @ApiProperty({ required: false })
  activationStatusChangeReason: string;

  @IsEnum(VerificationStatusEnum, {
    message: 'Selected status item is not in enum list .',
  })
  @IsString({ message: 'verificationStatus must be string.' })
  @ApiProperty({ required: false })
  verificationStatus: string;

  @IsEnum(VerificationStatusEnum, {
    message: 'Selected status item is not in enum list .',
  })
  @IsString({ message: 'verificationStatus must be string.' })
  @ApiProperty({ required: false })
  verificationStatusChangeReason: string;
}
