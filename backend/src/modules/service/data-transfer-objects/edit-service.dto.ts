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

export class editServiceDto {
  @IsNotEmpty({ message: 'serviceId is required and must be entered.' })
  @IsString({ message: 'serviceId must be string.' })
  @ApiProperty({ required: true })
  serviceId: string;

  @IsOptional()
  @IsString({ message: 'serviceName must be string.' })
  @ApiProperty({ required: false })
  serviceName: string;

  @IsOptional()
  @IsString({ message: 'description must be string and is optional.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @IsString({ message: 'serviceType must be string and is optional.' })
  @ApiProperty({ required: false })
  serviceType: string;

  @IsOptional()
  @IsString({ message: 'status must be string and is optional.' })
  @ApiProperty({ required: false })
  status: string;

  @IsOptional()
  @MinLength(2, {
    message: 'devices cannot be less than 2 letters and is optional.',
  })
  @IsString({
    message: 'devices must be array device blockly names. e.g. multi_sensor_1',
  })
  @ApiProperty({ required: false })
  devices: string[];

  @IsOptional()
  @MinLength(2, { message: 'serviceImage cannot be less than 2 letters.' })
  @IsString({ message: 'serviceImage must be string.' })
  @ApiProperty({ required: false })
  serviceImage: string;

  @IsOptional()
  @MinLength(2, {
    message: 'blocklyJson cannot be less than 2 letters and is optional.',
  })
  @IsString({ message: 'blocklyJson must be string.' })
  @ApiProperty({ required: false })
  blocklyJson: string;

  @IsOptional()
  @MinLength(2, {
    message: 'code cannot be less than 2 letters and is optional.',
  })
  @IsString({ message: 'code must be array device Ids.' })
  @ApiProperty({ required: false })
  code: string;
}
