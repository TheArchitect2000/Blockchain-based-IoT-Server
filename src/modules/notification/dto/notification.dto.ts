import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddNotificationRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userId: string;
}


export class ReadNotificationRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  notifications: string[];
}

