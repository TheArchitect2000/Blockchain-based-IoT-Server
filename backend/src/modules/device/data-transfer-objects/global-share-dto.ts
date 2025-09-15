import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GlobalShareDto {
  @IsOptional()
  @IsNumber({}, { message: 'costOfUse must be number.' })
  @ApiProperty({ required: false })
  costOfUse: number;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiProperty({
    required: true,
    type: [Number],
    description: 'Array of [latitude, longitude]',
  })
  coordinate: number[];
}
