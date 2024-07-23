import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  user: string;
}
