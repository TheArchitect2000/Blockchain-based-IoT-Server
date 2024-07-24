import {
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class makeUserAdminDto {
  @IsOptional()
  @IsString({ message: 'userName must be string.' })
  @ApiProperty({ required: true })
  userName: string;
}

