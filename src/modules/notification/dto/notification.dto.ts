import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  notifications: string[];
}

export class AddPublicNotificationRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  message: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  expiryDate: number;
}

export class EditNotificationRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  message: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
  expiryDate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  notifId: string;
}