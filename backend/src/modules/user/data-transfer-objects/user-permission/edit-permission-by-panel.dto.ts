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
import { RoleDepartmentsEnum } from '../../enums/role-departments.enum';

export class EditPermissionByPanelDto {
  // @IsOptional()
  @IsNotEmpty({ message: 'permissionId is required and must be entered.' })
  @IsString({ message: 'permissionId must be string.' })
  @ApiProperty({ required: true })
  permissionId: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'module is required and must be entered.' })
  @IsString({ message: 'module must be string.' })
  @ApiProperty({ required: true })
  module: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'label is required and must be entered.' })
  @IsString({ message: 'label must be string.' })
  @ApiProperty({ required: true })
  label: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'description is required and must be entered.' })
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: true })
  description: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'routes is required and must be entered.' })
  @IsString({ message: 'routes must be string.' })
  @ApiProperty({ required: true })
  routes: string[];

  // @IsOptional()
  @IsNotEmpty({ message: 'deletable is required and must be entered.' })
  @IsString({ message: 'deletable must be boolean.' })
  @ApiProperty({ required: true })
  deletable: boolean;
}
