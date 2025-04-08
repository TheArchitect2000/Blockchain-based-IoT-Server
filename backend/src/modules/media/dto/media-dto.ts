import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceTypeEnum } from 'src/modules/utility/enums/resource-type.enum';

export class uploadFileDto {
  @IsEnum(ResourceTypeEnum, { message: 'Selected type is not valid.' })
  @IsNotEmpty({ message: 'Selected type is required and must be entered.' })
  @ApiProperty({ required: false })
  type: string;

  @IsOptional()
  @ApiProperty({ required: false, description: 'Custom path within uploads directory (e.g. NFT/metadata)' })
  path?: string;
}
