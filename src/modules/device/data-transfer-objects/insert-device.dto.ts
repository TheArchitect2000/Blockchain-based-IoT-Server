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
  /* @IsNotEmpty({ message: 'userId is required and must be entered.' })
  @IsString({ message: 'userId must be string.' })
  @ApiProperty({ required: true })
  userId: string; */

  @IsOptional()
  @IsString({ message: 'deviceName must be string.' })
  @ApiProperty({ required: false })
  deviceName: string;

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

  @IsOptional()
  @IsNumber({}, { message: 'hardwareVersion must be number.' })
  @ApiProperty({ required: false })
  hardwareVersion: number;

  @IsOptional()
  @IsNumber({}, { message: 'firmwareVersion must be number.' })
  @ApiProperty({ required: false })
  firmwareVersion: number;

  @IsOptional()
  @MinLength(2, { message: 'parameters cannot be less than 2 letters.' })
  @IsString({ message: 'parameters must be array of JSON objects.' })
  @ApiProperty({ required: false })
  parameters: [];

  @IsOptional()
  @IsBoolean({ message: 'isShared must be boolean.' })
  @ApiProperty({ required: false })
  isShared: boolean;

  @IsOptional()
  @MinLength(2, { message: 'location cannot be less than 2 letters.' })
  @IsString({
    message:
      'location must be a JSON object in format {type: "Point", coordinates: [40,50]}.',
  })
  @ApiProperty({ required: false })
  location: string;

  @IsOptional()
  @MinLength(2, { message: 'geometry cannot be less than 2 letters.' })
  @IsString({
    message:
      'geometry is polygon area and must be a JSON object in format {type: "Polygon", coordinates: [[20,30], [40,50], ...]}.',
  })
  @ApiProperty({ required: false })
  geometry: string;
}
