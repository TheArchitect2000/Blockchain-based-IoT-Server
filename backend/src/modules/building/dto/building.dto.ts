import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBuildingRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  details: object;
}


export class EditBuildingRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  buildId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  data: object;
}