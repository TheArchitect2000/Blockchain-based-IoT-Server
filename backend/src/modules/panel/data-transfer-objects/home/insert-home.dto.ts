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

export class insertHomeDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'customerId is required and must be entered.' })
  @IsString({ message: 'customerId must be string.' })
  @ApiProperty({ required: true })
  customerId: string;

  @IsOptional()
  @MinLength(1, { message: 'name cannot be less than 5 letters.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @MinLength(6, { message: 'type cannot be less than 3 letters.' })
  @IsString({ message: 'type must be string.' })
  @ApiProperty({ required: false })
  type: string;

  /*   @IsOptional()
   @IsBoolean({ message: 'isActive must be boolean.' })
   @ApiProperty({ required: false })
   isActive: boolean; */

  @IsOptional()
  @MinLength(6, { message: 'timezone cannot be less than 3 letters.' })
  @IsString({ message: 'timezone must be string.' })
  @ApiProperty({ required: false })
  timezone: string;
}
