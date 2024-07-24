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

export class ChangeVerificationStatusGeneralDto {
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
  verificationStatus: string;

  // @IsOptional()
  @IsNotEmpty({
    message: 'verificationStatusChangeReason is required and must be entered.',
  })
  @IsString({ message: 'verificationStatusChangeReason must be string.' })
  @ApiProperty({ required: true })
  verificationStatusChangeReason: string;
}
