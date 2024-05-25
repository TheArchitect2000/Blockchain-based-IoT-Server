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

export class editInstalledServiceDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'installedServiceId is required and must be entered.',
  })
  @IsString({ message: 'installedServiceId must be string.' })
  @ApiProperty({ required: true })
  installedServiceId: string;

  @IsNotEmpty({ message: 'serviceId is required and must be entered.' })
  @IsString({ message: 'serviceId must be string.' })
  @ApiProperty({ required: true })
  serviceId: string;

  @IsOptional()
  @IsString({ message: 'installedServiceName must be string.' })
  @ApiProperty({ required: false })
  installedServiceName: string;

  @IsOptional()
  @IsString({ message: 'installedServiceName must be string.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @MinLength(2, {
    message:
      'blocklyJson is optional and is required if service has blockly JSON.',
  })
  @IsJSON({ message: 'deviceMap must be string and in json format.' })
  @ApiProperty({ required: false })
  deviceMap: string;
}
