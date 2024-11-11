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

export class insertServiceDto {
  // @IsOptional()
  /* @IsNotEmpty({ message: 'userId is required and must be entered.' })
  @IsString({ message: 'userId must be string.' })
  @ApiProperty({ required: true })
  userId: string; */

  @IsOptional()
  @IsString({ message: 'serviceName must be string.' })
  @ApiProperty({ required: false })
  serviceName: string;

  @IsOptional()
  @MinLength(5, { message: 'description cannot be less than 5 letters.' })
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @MinLength(3, { message: 'deviceType cannot be less than 3 letters.' })
  @IsString({ message: 'deviceType must be string.' })
  @ApiProperty({ required: false })
  serviceType: string;

  @IsOptional()
  @MinLength(2, { message: 'status cannot be less than 2 letters.' })
  @IsString({ message: 'status must be string.' })
  @ApiProperty({ required: false })
  status: string;

  @IsOptional()
  @MinLength(2, {
    message:
      'blocklyJson is optional and is required if service has blockly JSON.',
  })
  @IsString({ message: 'blocklyJson must be string and in json format.' })
  @ApiProperty({ required: false })
  blocklyJson: string;

  @IsOptional()
  @MinLength(2, { message: 'code cannot be less than 2 letters.' })
  @IsString({ message: 'code must be string.' })
  @ApiProperty({ required: false })
  code: string;

  @IsOptional()
  @MinLength(2, { message: 'devices cannot be less than 2 letters.' })
  @IsString({
    message:
      'devices must be array of device blockly names.  e.g. multi_sensor_1',
  })
  @ApiProperty({ required: false })
  devices: [];
}
