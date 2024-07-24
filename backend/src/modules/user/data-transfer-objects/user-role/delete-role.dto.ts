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

export class DeleteRoleDto {
  // @IsOptional()
  @IsNotEmpty({ message: '_id is required and must be entered.' })
  @IsString({ message: '_id must be string.' })
  @ApiProperty({ required: false })
  _id: String;

  // @IsOptional()
  @IsNotEmpty({ message: 'isDeleted is required and must be entered.' })
  @IsString({ message: 'isDeleted must be boolean.' })
  @ApiProperty({ required: true })
  isDeleted: boolean;

  // @IsOptional()
  @IsNotEmpty({ message: 'deletionReason is required and must be entered.' })
  @IsString({ message: 'deletionReason must be string.' })
  @ApiProperty({ required: true })
  deletionReason: string;
}
