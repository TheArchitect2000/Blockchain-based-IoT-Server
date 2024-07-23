import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class logDeviceEventDto {
  @IsNotEmpty({ message: 'deviceEncryptedId is required and must be entered.' })
  @IsString({ message: 'deviceEncryptedId must be string.' })
  @ApiProperty({ required: true })
  deviceEncryptedId: string;

  @IsNotEmpty({ message: 'event is required and must be entered.' })
  @IsString({ message: 'event must be string.' })
  @ApiProperty({ required: true })
  event: string;
}
