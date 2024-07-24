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

export class publishServiceDto {
  @IsNotEmpty({ message: 'serviceId is required and must be entered.' })
  @IsString({ message: 'serviceId must be string.' })
  @ApiProperty({ required: true })
  serviceId: string;
}
