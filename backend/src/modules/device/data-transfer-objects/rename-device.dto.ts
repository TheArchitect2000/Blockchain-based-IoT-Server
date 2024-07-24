import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class renameDeviceDto {
  @IsNotEmpty({ message: 'deviceId is required and must be entered.' })
  @IsString({ message: 'deviceId must be string.' })
  @ApiProperty({ required: true })
  deviceId: string;

  @IsNotEmpty({ message: 'deviceName is required and must be entered.' })
  @IsString({ message: 'deviceName must be string.' })
  @ApiProperty({ required: true })
  deviceName: string;
}
