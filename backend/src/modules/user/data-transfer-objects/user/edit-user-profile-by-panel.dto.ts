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


