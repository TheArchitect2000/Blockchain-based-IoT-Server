import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InsertStorxDto {
  @IsString({ message: 'accessGrant must be string.' })
  @ApiProperty({ required: true })
  accessGrant: string;
}
