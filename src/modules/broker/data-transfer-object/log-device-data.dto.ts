import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class logDeviceDataDto {
  @IsNotEmpty({ message: 'deviceEncryptedId is required and must be entered.' })
  @IsString({ message: 'deviceEncryptedId must be string.' })
  @ApiProperty({ required: true })
  deviceEncryptedId: string;

  @IsNotEmpty({ message: 'event is required and must be entered.' })
  @IsString({ message: 'event must be string.' })
  @ApiProperty({ required: true })
  event: string;

  @IsNotEmpty({ message: 'data is required and must be entered.' })
  @IsString({ message: 'data must be string and in json format.' })
  @ApiProperty({ required: true })
  data: string;

  @IsNotEmpty({
    message: 'senderDeviceEncryptedId is required and must be entered.',
  })
  @IsString({ message: 'senderDeviceEncryptedId must be string.' })
  @ApiProperty({ required: true })
  senderDeviceEncryptedId: string;
}
