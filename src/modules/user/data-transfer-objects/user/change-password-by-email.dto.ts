import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class changePasswordByEmailDto {
  @IsNotEmpty({ message: 'email is required and must be entered.' })
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'newPassword is required and must be entered.' })
  @IsNumber({}, { message: 'newPassword must be number.' })
  @ApiProperty({ required: true })
  newPassword: string;
}
