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

export class EditUserInfoProfileByUserDto {
  @IsOptional()
  // @IsNotEmpty({ message: 'nickName is required and must be entered.' })
  @IsString({ message: 'nickName must be string.' })
  @ApiProperty({ required: false })
  nickName: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'website is required and must be entered.' })
  @IsString({ message: 'website must be string.' })
  @ApiProperty({ required: false })
  website: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'telephone is required and must be entered.' })
  @IsString({ message: 'telephone must be string.' })
  @ApiProperty({ required: false })
  telephone: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'fax is required and must be entered.' })
  @IsString({ message: 'fax must be string.' })
  @ApiProperty({ required: false })
  fax: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'biography is required and must be entered.' })
  @IsString({ message: 'biography must be string.' })
  @ApiProperty({ required: false })
  biography: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'nationalCode is required and must be entered.' })
  @IsString({ message: 'nationalCode must be string.' })
  @ApiProperty({ required: false })
  nationalCode: string;
}
