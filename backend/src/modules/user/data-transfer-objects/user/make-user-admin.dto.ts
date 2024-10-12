import {
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class makeUserAdminDto {
  @IsOptional()
  @IsString({ message: 'userEmail must be string.' })
  @ApiProperty({ required: true })
  userEmail: string;
  
  @IsOptional()
  @IsString({ message: 'roleNames must be array of strings.' })
  @ApiProperty({ required: true })
  roleNames: Array<string>;
}

