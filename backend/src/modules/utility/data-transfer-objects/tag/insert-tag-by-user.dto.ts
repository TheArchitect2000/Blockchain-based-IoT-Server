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

export class InsertTagByUserDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;
}
