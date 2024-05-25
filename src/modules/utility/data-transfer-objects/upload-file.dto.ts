import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceTypeEnum } from '../enums/resource-type.enum';

export class uploadFileDto {
  @IsEnum(ResourceTypeEnum, { message: 'Selected type is not valid.' })
  @IsNotEmpty({ message: 'Selected type is required and must be entered.' })
  @ApiProperty({ required: false })
  type: string;
}
