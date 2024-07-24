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

export class deleteTagDto {
  @IsNotEmpty({ message: 'deletionReason is required and must be entered.' })
  @IsString({ message: 'deletionReason must be string.' })
  @ApiProperty({ required: true })
  deletionReason: string;
}
