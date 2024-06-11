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
  IsJSON,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class insertInstalledServiceDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'userId is required and must be entered.' })
  @IsString({ message: 'userId must be string.' })
  @ApiProperty({ required: true })
  userId: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'serviceId is required and must be entered.' })
  @IsString({ message: 'serviceId must be string.' })
  @ApiProperty({ required: true })
  serviceId: string;

  @IsOptional()
  @IsString({ message: 'installedServiceName must be string.' })
  @ApiProperty({ required: false })
  installedServiceName: string;

  @IsOptional()
  @IsString({ message: 'installedServiceImage must be string.' })
  @ApiProperty({ required: false })
  installedServiceImage: string;

  @IsOptional()
  @MinLength(5, { message: 'description cannot be less than 5 letters.' })
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @MinLength(5, { message: 'code cannot be less than 5 letters.' })
  @IsString({ message: 'code must be string.' })
  @ApiProperty({ required: false })
  code: string;

  @IsOptional()
  @MinLength(2, {
    message:
      'deviceMap is optional and is required if service has blockly JSON.',
  })
  @IsJSON({ message: 'deviceMap must be string and in json format.' })
  @ApiProperty({ required: false })
  deviceMap: {
    MULTI_SENSOR_1: string
  };
}


