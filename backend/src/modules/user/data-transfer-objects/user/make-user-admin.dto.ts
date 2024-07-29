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
  
  @IsOptional()
  @IsString({ message: 'roleNames must be array of strings.' })
  @ApiProperty({ required: true })
  roleNames: Array<string>;
}

