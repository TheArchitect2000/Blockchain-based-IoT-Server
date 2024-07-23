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

export class EditCategoryByPanelDto {
  // @IsOptional()
  @IsNotEmpty({ message: '_id is required and must be entered.' })
  @IsString({ message: '_id must be string.' })
  @ApiProperty({ required: true })
  _id: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'description is required and must be entered.' })
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'parent is required and must be entered.' })
  @IsString({ message: 'parent must be string.' })
  @ApiProperty({ required: false })
  parent: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'tags is required and must be entered.' })
  @IsString({ message: 'tags must be string.' })
  @ApiProperty({ required: false })
  tags: string[];

  @IsOptional()
  // @IsNotEmpty({ message: 'image is required and must be entered.' })
  @IsString({ message: 'image must be string.' })
  @ApiProperty({ required: false })
  image: string;
}
