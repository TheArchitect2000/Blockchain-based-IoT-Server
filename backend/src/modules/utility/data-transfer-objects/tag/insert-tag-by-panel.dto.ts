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
import { ActivationStatusEnum } from './../../enums/activation-status.enum';
import { VerificationStatusEnum } from '../../enums/verification-status.enum';

export class insertTagByPanelDto {
  @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;

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
