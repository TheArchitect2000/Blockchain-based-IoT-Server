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

export class InsertRoleByPanelDto {
  @IsEnum(RoleDepartmentsEnum, { message: 'department name is not valid.' })
  @IsNotEmpty({ message: 'department is required and must be entered.' })
  @ApiProperty()
  department: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'name is required and must be entered.' })
  @IsString({ message: 'name must be string.' })
  @ApiProperty({ required: true })
  name: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'label is required and must be entered.' })
  @IsString({ message: 'label must be string.' })
  @ApiProperty({ required: true })
  label: string;

  @IsOptional()
  // @IsNotEmpty({ message: 'description is required and must be entered.' })
  @IsString({ message: 'description must be string.' })
  @ApiProperty({ required: true })
  description: string;

  // @IsOptional()
  @IsNotEmpty({ message: 'deletable is required and must be entered.' })
  @IsString({ message: 'deletable must be boolean.' })
  @ApiProperty({ required: true })
  deletable: boolean;

  @IsOptional()
  // @IsNotEmpty({ message: 'permissions is required and must be entered.' })
  @IsString({ message: 'permissions must be string.' })
  @ApiProperty({ required: true })
  permissions: string[];
}
