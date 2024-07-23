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

export class ChangeActivationStatusGeneralDto {
  // @IsOptional()
  @IsNotEmpty({ message: '_id is required and must be entered.' })
  @IsString({ message: '_id must be string.' })
  @ApiProperty({ required: false })
  _id: String;

  // @IsOptional()
  @IsNotEmpty({
    message: 'verificationStatus is required and must be entered.',
  })
  @IsString({ message: 'verificationStatus must be string.' })
  @ApiProperty({ required: true })
  activationStatus: string;

  // @IsOptional()
  @IsNotEmpty({
    message: 'activationStatusChangeReason is required and must be entered.',
  })
  @IsString({ message: 'activationStatusChangeReason must be string.' })
  @ApiProperty({ required: true })
  activationStatusChangeReason: string;
}
