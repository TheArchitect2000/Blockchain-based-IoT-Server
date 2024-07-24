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

export class SendTokenRequestBodyDto {
  // @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  token: string;
}
