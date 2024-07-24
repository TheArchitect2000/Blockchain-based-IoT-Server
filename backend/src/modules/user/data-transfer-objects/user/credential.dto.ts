import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class credentialDto {
  @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'password is required and must be entered.' })
  @IsNumber({}, { message: 'password must be number.' })
  @ApiProperty({ required: true })
  password: string;
}


export class checkPasswordDto {
  @IsNotEmpty({ message: 'Entered password is required and must be entered.' })
  @IsNumber({}, { message: 'Entered password must be number.' })
  @ApiProperty({ required: true })
  enteredPassword: string;

  @IsNotEmpty({ message: 'User password is required and must be entered.' })
  @IsNumber({}, { message: 'User password must be number.' })
  @ApiProperty({ required: true })
  userPassword: string;
}