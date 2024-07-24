import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDefined,
  MaxLength,
  ArrayMinSize,
  IsString,
  MinLength,
  ValidateNested,
  ArrayUnique,
  Matches,
  IsBoolean,
  IsNumber,
  IsNumberOptions,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class insertCustomerDto {
  @IsOptional()
  @IsBoolean({ message: 'isActive must be boolean.' })
  @ApiProperty({ required: false })
  isActive: boolean;

  @IsOptional()
  @IsString({ message: 'email must be string.' })
  @ApiProperty({ required: true })
  email: string;

  @IsOptional()
  @MinLength(5, { message: 'userName cannot be less than 5 letters.' })
  @IsString({ message: 'userName must be string.' })
  @ApiProperty({ required: false })
  userName: string;

  @IsOptional()
  @MinLength(6, { message: 'password cannot be less than 6 letters.' })
  @IsString({ message: 'password must be string.' })
  @ApiProperty({ required: false })
  password: string;

  @IsOptional()
  @MinLength(2, { message: 'firstName cannot be less than 2 letters.' })
  @IsString({ message: 'firstName must be string.' })
  @ApiProperty({ required: false })
  firstName: string;

  @IsOptional()
  @MinLength(2, { message: 'lastName cannot be less than 2 letters.' })
  @IsString({ message: 'lastName must be string.' })
  @ApiProperty({ required: false })
  lastName: string;

  @Matches(/^(09){1}[0-9]{9}$/, { message: 'mobile number is not valid' })
  @IsNotEmpty({ message: 'mobile is required and must be entered.' })
  @IsString({ message: 'mobile must be string.' })
  @ApiProperty({ required: false })
  mobile: string;
}
