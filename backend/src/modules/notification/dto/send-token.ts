import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendTokenRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  token: string;
}
