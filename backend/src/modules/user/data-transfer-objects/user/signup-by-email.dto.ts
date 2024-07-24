import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class signupByEmailDto {
  @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'password is required and must be entered.' })
  @IsNumber({}, { message: 'password must be number.' })
  @ApiProperty({ required: true })
  password: string;
}
