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

export class insertDeviceDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'homeId is required and must be entered.' })
  @IsString({ message: 'homeId must be string.' })
  @ApiProperty({ required: true })
  homeId: string;

  @IsOptional()
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @MinLength(5, { message: 'deviceType cannot be less than 5 letters.' })
  @IsString({ message: 'deviceType must be string.' })
  @ApiProperty({ required: false })
  deviceType: string;

  @IsOptional()
  @MinLength(2, { message: 'mac cannot be less than 2 letters.' })
  @IsString({ message: 'mac must be string.' })
  @ApiProperty({ required: false })
  mac: string;
}
