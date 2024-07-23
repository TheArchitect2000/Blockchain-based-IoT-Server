import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class renameDeviceDto {
  @IsNotEmpty({ message: 'deviceId is required and must be entered.' })
  @IsString({ message: 'deviceId must be string.' })
  @ApiProperty({ required: true })
  deviceId: string;

  @IsNotEmpty({ message: 'newName is required and must be entered.' })
  @IsNumber({}, { message: 'newName must be number.' })
  @ApiProperty({ required: true })
  newName: string;
}
