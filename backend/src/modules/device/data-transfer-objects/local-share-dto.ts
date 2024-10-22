import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocalShareDto {
  @IsNotEmpty({ message: 'deviceId is required and must be entered.' })
  @IsString({ message: 'deviceId must be string.' })
  @ApiProperty({ required: true })
  deviceId: string;

  @IsNotEmpty({ message: 'userEmail is required and must be entered.' })
  @IsString({ message: 'userEmail must be string.' })
  @ApiProperty({ required: true })
  userEmail: string;
}
