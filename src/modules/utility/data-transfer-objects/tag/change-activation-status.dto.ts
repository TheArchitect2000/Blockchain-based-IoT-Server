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

export class changeActivationStatusDto {
  @IsNotEmpty({
    message: 'activationStatusChangeReason is required and must be entered.',
  })
  @IsString({ message: 'activationStatusChangeReason must be string.' })
  @ApiProperty({ required: true })
  activationStatusChangeReason: string;
}
